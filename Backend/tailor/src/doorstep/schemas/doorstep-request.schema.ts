// src/doorstep/schemas/doorstep-request.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DoorstepRequestDocument = HydratedDocument<DoorstepRequest>;

@Schema({ timestamps: true })
export class DoorstepRequest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  preferredDate: string;

  @Prop({ required: true })
  preferredTime: string;

  @Prop()
  notes?: string;

  @Prop({ default: 'Pending' })
  status: string; // Pending -> Scheduled -> Completed -> Cancelled
}

export const DoorstepRequestSchema = SchemaFactory.createForClass(DoorstepRequest);