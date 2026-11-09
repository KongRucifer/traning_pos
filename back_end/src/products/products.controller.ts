import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /products            → all products
  // GET /products?categoryId=1 → only drinks
  @Get()
  findAll(@Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number) {
    return this.productsService.findAll(categoryId);
  }
}
