import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { OrderItem } from './order-item.entity.js';

// Maps to table: orders (1 row = 1 bill)
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_amount', type: 'int' })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // 1 order has many order_items
  @OneToMany(() => OrderItem, (item) => item.order)
  items: Relation<OrderItem[]>;
}
