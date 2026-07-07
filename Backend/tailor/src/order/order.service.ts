import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { SubmitQuoteDto } from './dto/submit-quote.dto';

//import { RejectOrderDto } from './dto/Reject-order.dto';
//import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
//import { MailService } from '../notification/mail.service';
import { User } from '../user/schema/user.schema'; // adjust path if different

const STATUS_FLOW = ['Confirmed', 'In Progress', 'Ready', 'Delivered'];

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

   // private readonly mailService: MailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    if (createOrderDto.budgetMax < createOrderDto.budgetMin) {
      throw new BadRequestException('budgetMax cannot be less than budgetMin');
    }

    const order = new this.orderModel({
      ...createOrderDto,
      status: 'Pending Admin Review',
    });

    await order.save();

    this.notifyOrderCreated(createOrderDto, order);

    return {
      message: 'Order placed successfully',
      order: this.toCustomerSafeOrder(order),
    };
  }

  async getOrdersByCustomer(customerId: string) {
    const orders = await this.orderModel
      .find({ customerId })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) return [];

    const tailorIds = [...new Set(orders.map(o => o.tailorId))];
    const tailors = await this.userModel.find({ _id: { $in: tailorIds } }).lean();
    const tailorMap = new Map(tailors.map(t => [String(t._id), t.name]));

    return orders.map(order => ({
      ...this.toCustomerSafeOrder(order),
      // tailorName: tailorMap.get(order.tailorId) ?? 'Unknown Tailor',
      tailorName: tailorMap.get(order.tailorId.toString()) ?? 'Unknown Tailor',
    }));
  }

  // strips tailorQuote/adminMargin before anything reaches a customer response
  private toCustomerSafeOrder(order: any) {
    const { tailorQuote, adminMargin, ...safe } = order.toObject ? order.toObject() : order;
    return safe;
  }

  // ------------------------------------------------------------------
  // Admin actions
  // ------------------------------------------------------------------

  async getPendingReviewOrders() {
    const orders = await this.orderModel
      .find({ status: 'Pending Admin Review' })
      .sort({ createdAt: 1 })
      .lean();

    return this.enrichWithNames(orders);
  }

  async getAwaitingConfirmationOrders() {
    const orders = await this.orderModel
      .find({ status: 'Awaiting Customer Confirmation' })
      .sort({ createdAt: 1 })
      .lean();

    return this.enrichWithNames(orders);
  }

  private async enrichWithNames(orders: any[]) {
    if (orders.length === 0) return [];

    const userIds = [...new Set(orders.flatMap(o => [o.customerId, o.tailorId]))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).lean();
    const nameMap = new Map(users.map(u => [String(u._id), u.name]));

    return orders.map(order => ({
      ...order,
      customerName: nameMap.get(order.customerId) ?? 'Unknown Customer',
      tailorName: nameMap.get(order.tailorId) ?? 'Unknown Tailor',
    }));
  }

  // admin calls the tailor, gets a quote, adds margin, submits both at once
  async submitQuote(orderId: string, dto: SubmitQuoteDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'Pending Admin Review') {
      throw new BadRequestException('Only orders awaiting review can receive a quote');
    }

    order.tailorQuote = dto.tailorQuote;
    order.adminMargin = dto.adminMargin;
    order.finalPrice = dto.tailorQuote + dto.adminMargin;
    order.adminNotes = dto.adminNotes;
    order.status = 'Awaiting Customer Confirmation';
    await order.save();

    this.notifyQuoteReady(order);

    return { message: 'Quote submitted, awaiting customer confirmation', order };
  }

  async rejectOrder(orderId: string, dto: any) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'Pending Admin Review') {
      throw new BadRequestException('Only orders awaiting review can be rejected');
    }

    order.status = 'Rejected';
    order.adminNotes = dto.adminNotes;
    await order.save();

    return { message: 'Order rejected', order };
  }

  // ------------------------------------------------------------------
  // Customer actions
  // ------------------------------------------------------------------

  async confirmOrder(orderId: string, customerId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
  if (order.customerId.toString() !== customerId) {
      throw new BadRequestException('This order does not belong to you');
    }
    if (order.status !== 'Awaiting Customer Confirmation') {
      throw new BadRequestException('This order is not awaiting confirmation');
    }

    order.status = 'Confirmed';
    await order.save();

    this.notifyOrderConfirmedToTailor(order);

    return { message: 'Order confirmed', order: this.toCustomerSafeOrder(order) };
  }

  async cancelOrder(orderId: string, customerId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
  if (order.customerId.toString() !== customerId) {
      throw new BadRequestException('This order does not belong to you');
    }
    if (order.status !== 'Awaiting Customer Confirmation') {
      throw new BadRequestException('This order cannot be cancelled at this stage');
    }

    order.status = 'Cancelled by Customer';
    await order.save();

    return { message: 'Order cancelled', order: this.toCustomerSafeOrder(order) };
  }

  // ------------------------------------------------------------------
  // Tailor actions
  // ------------------------------------------------------------------

  async getOrdersForTailor(tailorId: string) {
    const orders = await this.orderModel
      .find({
        tailorId,
        status: { $in: ['Confirmed', 'In Progress', 'Ready', 'Delivered'] },
      })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) return [];

    const customerIds = [...new Set(orders.map(o => o.customerId))];
    const customers = await this.userModel.find({ _id: { $in: customerIds } }).lean();
    const nameMap = new Map(customers.map(c => [String(c._id), c.name]));

    // tailorQuote/adminMargin stay hidden from the tailor too — they already
    // told the admin their own price, no need to also show them the margin
    return orders.map(({ tailorQuote, adminMargin, ...order }) => ({
      ...order,
      customerName: nameMap.get(order.customerId.toString()) ?? 'Unknown Customer',
    }));
  }

  async updateOrderStatusByTailor(orderId: string, dto: any) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.tailorId !== dto.tailorId) {
      throw new BadRequestException('This order is not assigned to you');
    }

    const currentIndex = STATUS_FLOW.indexOf(order.status);
    const nextIndex = STATUS_FLOW.indexOf(dto.status);

    if (currentIndex === -1 || nextIndex !== currentIndex + 1) {
      throw new BadRequestException(
        `Cannot move from "${order.status}" to "${dto.status}" — statuses must progress one step at a time`
      );
    }

    order.status = dto.status;
    await order.save();

    return { message: 'Order status updated', order };
  }

  // ------------------------------------------------------------------
  // Notifications
  // ------------------------------------------------------------------

  private async notifyOrderCreated(dto: CreateOrderDto, order: Order) {
    try {
      const [customer, tailor] = await Promise.all([
        this.userModel.findById(dto.customerId),
        this.userModel.findById(dto.tailorId),
      ]);

      // if (customer?.email) {
      //   this.mailService.sendOrderConfirmationToCustomer(customer.email, order);
      // }
      // if (tailor?.email) {
      //   this.mailService.sendNewOrderAlertToTailor(tailor.email, order);
      // }
    } catch (err) {
      console.error('Failed to send order-created notifications', err);
    }
  }

  private async notifyQuoteReady(order: Order) {
    try {
      const customer = await this.userModel.findById(order.customerId);
      if (customer?.email) {
        // TODO: write a dedicated "your quote is ready, please confirm" email template
        //this.mailService.sendOrderConfirmationToCustomer(customer.email, order);
      }
    } catch (err) {
      console.error('Failed to send quote-ready notification', err);
    }
  }

  private async notifyOrderConfirmedToTailor(order: Order) {
    try {
      const tailor = await this.userModel.findById(order.tailorId);
      if (tailor?.email) {
       // this.mailService.sendNewOrderAlertToTailor(tailor.email, order);
      }
    } catch (err) {
      console.error('Failed to notify tailor of confirmed order', err);
    }
  }
}