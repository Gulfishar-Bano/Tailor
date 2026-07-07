// src/admin/admin-orders.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { AdminOrdersService } from './admin-order.service';

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  async getAllOrders(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.adminOrdersService.findAll({
      status,
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }
}