import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tailorId: Types.ObjectId;

  @Prop({ required: true })
  garmentType: string;

  @Prop()
  fabricColor: string;

  @Prop()
  description: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  budgetMin: number;

  @Prop({ required: true })
  budgetMax: number;

  @Prop({ required: false })
  tailorQuote?: number;

  @Prop({ required: false })
  adminMargin?: number;

  @Prop({ required: false })
  finalPrice?: number;

  @Prop({
    default: 'Pending Admin Review',
  })
  status: string;

  @Prop({ required: false })
  adminNotes?: string;

  @Prop()
  expectedDelivery: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);