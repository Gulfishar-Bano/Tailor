import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {

    const order = new this.orderModel({
      ...createOrderDto,
      status: 'Pending',
    });

    await order.save();

    return {
      message: 'Order placed successfully',
      order,
    };
  }

  async getAllOrders() {
  return await this.orderModel.find().sort({ createdAt: -1 });
}

async getOrderById(id: string) {
  return await this.orderModel.findById(id);
}

async assignTailor(
  orderId: string,
  tailorId: string,
) {

  return await this.orderModel.findByIdAndUpdate(
    orderId,
    {
      tailorId,
      status: 'Assigned',
    },
    {
      new: true,
    },
  );
}
}