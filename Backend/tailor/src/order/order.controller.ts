import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SubmitQuoteDto } from './dto/submit-quote.dto';
import { RejectOrderDto } from './dto/Reject-order.dto';
//import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post('create')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('customer/:customerId')
  getCustomerOrders(@Param('customerId') customerId: string) {
    return this.orderService.getOrdersByCustomer(customerId);
  }

  // --- Customer actions ---

  @Patch(':orderId/confirm')
  confirmOrder(
    @Param('orderId') orderId: string,
    @Body('customerId') customerId: string,
  ) {
    return this.orderService.confirmOrder(orderId, customerId);
  }

  @Patch(':orderId/cancel')
  cancelOrder(
    @Param('orderId') orderId: string,
    @Body('customerId') customerId: string,
  ) {
    return this.orderService.cancelOrder(orderId, customerId);
  }

  // --- Tailor actions ---
  // NOTE: also needs an auth guard eventually — right now tailorId is
  // just trusted from the request body.

  @Get('tailor/:tailorId')
  getOrdersForTailor(@Param('tailorId') tailorId: string) {
    return this.orderService.getOrdersForTailor(tailorId);
  }

  @Patch(':orderId/status')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: any,
  ) {
    return this.orderService.updateOrderStatusByTailor(orderId, dto);
  }

  // --- Admin actions ---
  // NOTE: not yet protected by an admin-only auth guard — add one before
  // this goes anywhere near production, since real payout numbers live here.

  @Get('admin/pending')
  getPendingReviewOrders() {
    return this.orderService.getPendingReviewOrders();
  }

  @Get('admin/awaiting-confirmation')
  getAwaitingConfirmationOrders() {
    return this.orderService.getAwaitingConfirmationOrders();
  }

  @Patch('admin/:orderId/quote')
  submitQuote(
    @Param('orderId') orderId: string,
    @Body() dto: SubmitQuoteDto,
  ) {
    return this.orderService.submitQuote(orderId, dto);
  }

  @Patch('admin/:orderId/reject')
  rejectOrder(
    @Param('orderId') orderId: string,
    @Body() dto: RejectOrderDto,
  ) {
    return this.orderService.rejectOrder(orderId, dto);
  }
}