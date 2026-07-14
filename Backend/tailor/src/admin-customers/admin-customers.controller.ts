import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdminCustomersService } from './admin-customers.service';

@Controller('admin/customers')
export class AdminCustomersController {
  constructor(private readonly adminCustomersService: AdminCustomersService) {}

  @Get()
  async getAllCustomers(
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.adminCustomersService.findAll({
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  async getCustomerDetail(@Param('id') id: string) {
    return this.adminCustomersService.findOne(id);
  }
}