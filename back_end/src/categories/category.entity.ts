import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Maps to table: categories
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
