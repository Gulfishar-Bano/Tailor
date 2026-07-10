import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from '../user/schema/user.schema'; // TODO: adjust to your actual User schema path/name
import { MailService } from './Mail.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService,MailService],
})
export class OrderModule {}