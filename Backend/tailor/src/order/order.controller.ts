import { Body, Controller, Post,Get,Param,Patch} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AssignTailorDto } from './dto/assign-tailor.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Post('create')
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Get('list')
getAllOrders() {
  return this.orderService.getAllOrders();
}

@Get('list/:id')
getOrderById(
  @Param('id') id: string,
) {
  return this.orderService.getOrderById(id);
}

@Patch(':id/assign')
assignTailor(
  @Param('id') id: string,
  @Body() body: AssignTailorDto,
) {
  return this.orderService.assignTailor(
    id,
    body.tailorId,
  );
}
}