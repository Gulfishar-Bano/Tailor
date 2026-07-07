// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminOrdersController } from './admin-order.controller';
import { AdminOrdersService } from './admin-order.service';
import { Order, OrderSchema } from '../order/schema/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [AdminOrdersController],
  providers: [AdminOrdersService],
})
export class AdminOrderModule {}