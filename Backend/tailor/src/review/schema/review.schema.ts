import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ required: true })
  tailorId: string;

  // optional now — admin-added reviews (collected by phone) may not have a
  // real customer account yet during the early testing phase
  @Prop({ required: false })
  customerId?: string;

  // free-text name for when there's no real customerId (e.g. "Priya S." from a phone call)
  @Prop({ required: false })
  customerName?: string;

  @Prop({ required: false })
  orderId?: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: false })
  comment?: string;

  @Prop({ default: false })
  addedByAdmin: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);