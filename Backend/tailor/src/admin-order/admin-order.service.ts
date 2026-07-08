// src/admin/admin-orders.service.ts
import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddMarginDto } from '../order/dto/add-margin.dto'; // adjust path
import { Order } from '../order/schema/order.schema'; // adjust path to your actual schema

interface FindAllParams {
  status?: string;
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class AdminOrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll({ status, search, page, limit }: FindAllParams) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { garmentType: { $regex: search, $options: 'i' } },
        { style: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .populate('customerId', 'name email phone') // adjust field names to your schema
          .populate('tailorId', 'name phone city specialization')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.orderModel.countDocuments(filter),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  

async forwardToTailor(orderId: string) {
  const order = await this.orderModel.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'Pending Admin Review') {
    throw new BadRequestException('Only orders awaiting review can be sent to the tailor');
  }

  order.status = 'Awaiting Tailor Quote';
  await order.save();

  // optional: notify the tailor, if you have MailService/userModel injected here
  // const tailor = await this.userModel.findById(order.tailorId);
  // if (tailor?.email) this.mailService.sendNewOrderAlertToTailor(tailor.email, order);

  return { message: 'Order sent to tailor for a quote', order };
}

async getTailorQuotedOrders() {
  const orders = await this.orderModel
    .find({ status: 'Tailor Quoted' })
    .sort({ createdAt: 1 })
    .lean();

  // reuse whatever enrichment/population logic your findAll() already has
  // for customerId/tailorId — this needs the same names attached
  return orders;
}

async addMarginAndFinalize(orderId: string, dto: AddMarginDto) {
  const order = await this.orderModel.findById(orderId);
  if (!order) throw new NotFoundException('Order not found');
  if (order.status !== 'Tailor Quoted') {
    throw new BadRequestException('This order does not have a tailor quote yet');
  }
  if (order.tailorQuote == null) {
    throw new BadRequestException('Tailor quote is missing on this order');
  }

  order.adminMargin = dto.adminMargin;
  order.finalPrice = order.tailorQuote + dto.adminMargin;
  order.adminNotes = dto.adminNotes;
  order.status = 'Awaiting Customer Confirmation';
  await order.save();

  return { message: 'Final price set, awaiting customer confirmation', order };
}

// admin-orders.service.ts — add this method
async updateStatus(orderId: string, status: string, adminNotes?: string) {
  const update: any = { status };
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  const order = await this.orderModel
    .findByIdAndUpdate(orderId, update, { new: true })
    .populate('customerId', 'name email phone')
    .populate('tailorId', 'name phone city specialization')
    .lean();

  return { message: 'Status updated', order };
}
}