// src/measurement/schemas/measurement.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MeasurementDocument = HydratedDocument<Measurement>;

@Schema({ timestamps: true })
export class Measurement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop() chest?: number;
  @Prop() waist?: number;
  @Prop() hip?: number;
  @Prop() shoulder?: number;
  @Prop() length?: number;
  @Prop() sleeveLength?: number;
  @Prop() neck?: number;
  @Prop() inseam?: number;

  @Prop()
  notes?: string;
}

export const MeasurementSchema = SchemaFactory.createForClass(Measurement);