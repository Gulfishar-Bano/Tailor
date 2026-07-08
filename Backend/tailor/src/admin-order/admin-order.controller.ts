
// ADD to your existing admin-orders.controller.ts

import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminOrdersService } from './admin-order.service';
import { AddMarginDto } from '../order/dto/add-margin.dto'; // adjust path to wherever your Order DTOs live

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

  // --- NEW: three-step quote flow ---

  @Patch(':orderId/forward-to-tailor')
  forwardToTailor(@Param('orderId') orderId: string) {
    return this.adminOrdersService.forwardToTailor(orderId);
  }

  @Get('tailor-quoted')
  getTailorQuotedOrders() {
    return this.adminOrdersService.getTailorQuotedOrders();
  }

  @Patch(':orderId/margin')
  addMarginAndFinalize(
    @Param('orderId') orderId: string,
    @Body() dto: AddMarginDto,
  ) {
    return this.adminOrdersService.addMarginAndFinalize(orderId, dto);
  }

   @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; adminNotes?: string },
  ) {
    return this.adminOrdersService.updateStatus(id, body.status, body.adminNotes);
  }
}