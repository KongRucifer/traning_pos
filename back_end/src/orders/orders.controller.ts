import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrdersService } from './orders.service.js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /checkout   body: { items: [{ productId, quantity }] }
  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.ordersService.checkout(dto);
  }

  // GET /orders
  @Get('orders')
  findAll() {
    return this.ordersService.findAll();
  }

  // GET /orders/5
  @Get('orders/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }
}
