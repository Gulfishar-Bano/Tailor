import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {

  @Prop({
    required: true,
  })
  customerId: string;

  @Prop({
    required: true,
  })
  tailorId: string;

  @Prop({
    required: true,
  })
  garmentType: string;

  @Prop()
  fabricColor: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop({
    default: 'Pending',
  })
  status: string;

  @Prop()
  expectedDelivery: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);