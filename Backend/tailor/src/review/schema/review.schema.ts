import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ required: true })
  tailorId: string;

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: false })
  comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);