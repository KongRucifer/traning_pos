import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../products/product.entity.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderItem } from './order-item.entity.js';
import { Order } from './order.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /**
   * Checkout flow (all inside ONE transaction — all succeed or all fail):
   *   1. Lock the products being sold (so 2 cashiers can't sell the last item twice)
   *   2. Check stock is enough
   *   3. Reduce stock           → UPDATE products
   *   4. Create the bill        → INSERT INTO orders
   *   5. Save each bill line    → INSERT INTO order_items
   */
  async checkout(dto: CheckoutDto) {
    // Merge duplicate lines: [{id:1,qty:1},{id:1,qty:2}] → {1: 3}
    const qtyByProductId = new Map<number, number>();
    for (const item of dto.items) {
      qtyByProductId.set(item.productId, (qtyByProductId.get(item.productId) ?? 0) + item.quantity);
    }
    const productIds = [...qtyByProductId.keys()];

    const orderId = await this.dataSource.transaction(async (manager) => {
      // 1. SELECT ... FROM products WHERE id IN (...) FOR UPDATE
      const products = await manager.find(Product, {
        where: { id: In(productIds) },
        order: { id: 'ASC' },
        lock: { mode: 'pessimistic_write' },
      });

      if (products.length !== productIds.length) {
        const found = new Set(products.map((p) => p.id));
        const missing = productIds.filter((id) => !found.has(id));
        throw new NotFoundException(`ບໍ່ພົບສິນຄ້າ id: ${missing.join(', ')}`);
      }

      // 2 + 3. Check stock and calculate total using DB prices
      let totalAmount = 0;
      for (const product of products) {
        const qty = qtyByProductId.get(product.id)!;
        if (product.stock < qty) {
          throw new BadRequestException(
            `ສິນຄ້າ "${product.name}" ບໍ່ພໍ (ເຫຼືອ ${product.stock}, ຕ້ອງການ ${qty})`,
          );
        }
        product.stock -= qty;
        totalAmount += product.price * qty;
      }
      await manager.save(products);

      // 4. Create the bill
      const order = await manager.save(manager.create(Order, { totalAmount }));

      // 5. Save bill lines with the price at time of sale
      const items = products.map((product) =>
        manager.create(OrderItem, {
          orderId: order.id,
          productId: product.id,
          quantity: qtyByProductId.get(product.id)!,
          price: product.price,
        }),
      );
      await manager.save(items);

      return order.id;
    });

    return this.findOne(orderId);
  }

  // Latest 20 bills with their items
  findAll() {
    return this.orderRepo.find({
      relations: { items: { product: true } },
      order: { id: 'DESC', items: { id: 'ASC' } },
      take: 20,
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { items: { product: true } },
      order: { items: { id: 'ASC' } },
    });
    if (!order) throw new NotFoundException(`ບໍ່ພົບບິນເລກທີ ${id}`);
    return order;
  }
}
