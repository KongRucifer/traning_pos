import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Category } from '../categories/category.entity.js';

// Maps to table: products
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  price: number; // ກີບ (kip)

  @Column('int')
  stock: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  // products.category_id → categories.id  (many products belong to 1 category)
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;
}
