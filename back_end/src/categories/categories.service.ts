import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // SQL: SELECT * FROM categories ORDER BY id
  findAll() {
    return this.categoryRepo.find({ order: { id: 'ASC' } });
  }
}
