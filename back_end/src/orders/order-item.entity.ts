import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Product } from '../products/product.entity.js';
import { Order } from './order.entity.js';

// Maps to table: order_items (1 row = 1 product line inside a bill)
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int' })
  orderId: number;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @Column('int')
  quantity: number;

  // Price AT THE TIME OF SALE (copied from products.price)
  @Column('int')
  price: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;
}
