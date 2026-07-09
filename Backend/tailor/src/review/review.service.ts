
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Review } from './schema/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateAdminReviewDto } from './dto/create-admin-review.dto';
import { Order } from '../order/schema/order.schema';
import { User } from '../user/schema/user.schema'; // adjust path if different from order.service.backend.ts

const REVIEWABLE_STATUSES = ['Delivered', 'Completed'];

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,

    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createReview(dto: CreateReviewDto) {
    const order = await this.orderModel.findById(dto.orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customerId.toString() !== dto.customerId || order.tailorId.toString() !== dto.tailorId) {
      throw new BadRequestException('This order does not belong to this customer/tailor pair');
    }
    if (!REVIEWABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException('You can only review completed orders');
    }

    const existing = await this.reviewModel.findOne({ orderId: dto.orderId });
    if (existing) {
      throw new BadRequestException('This order has already been reviewed');
    }

    const review = new this.reviewModel(dto);
    await review.save();

    return { message: 'Review submitted', review };
  }

  // admin-added review — no order or customer account required, since these
  // are collected by phone during the early testing phase
  async createAdminReview(dto: CreateAdminReviewDto) {
    const tailor = await this.userModel.findById(dto.tailorId);
    if (!tailor) {
      throw new NotFoundException('Tailor not found');
    }

    const review = new this.reviewModel({
      ...dto,
      addedByAdmin: true,
    });
    await review.save();

    return { message: 'Review added', review };
  }

  async getReviewsForTailor(tailorId: string) {
    const reviews = await this.reviewModel
      .find({ tailorId })
      .sort({ createdAt: -1 })
      .lean();

    if (reviews.length === 0) {
      return { averageRating: 0, count: 0, reviews: [] };
    }

    // only real customer accounts need a name lookup — admin-added
    // reviews already carry their own customerName string
    const customerIds = [...new Set(reviews.filter(r => r.customerId).map(r => r.customerId))];
    const customers = customerIds.length
      ? await this.userModel.find({ _id: { $in: customerIds } }).lean()
      : [];
    const nameMap = new Map(customers.map(c => [String(c._id), c.name]));

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      count: reviews.length,
      reviews: reviews.map(r => ({
        ...r,
        customerName: r.customerName ?? (r.customerId ? nameMap.get(r.customerId) : null) ?? 'Anonymous',
      })),
    };
  }
}