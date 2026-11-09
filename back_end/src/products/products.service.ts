import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // SQL: SELECT * FROM products [WHERE category_id = $1] ORDER BY id
  findAll(categoryId?: number) {
    return this.productRepo.find({
      where: categoryId ? { categoryId } : {},
      order: { id: 'ASC' },
    });
  }
}
