// src/measurement/measurement.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measurement, MeasurementDocument } from './schemas/measurement.schema';
import { SaveMeasurementDto } from './dto/save-measurement.dto';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectModel(Measurement.name) private model: Model<MeasurementDocument>,
  ) {}

  // upsert — one saved measurement profile per customer, updated in place
  async save(dto: SaveMeasurementDto) {
    return this.model.findOneAndUpdate(
      { customerId: dto.customerId },
      { $set: dto },
      { new: true, upsert: true },
    );
  }

  async getByCustomer(customerId: string) {
    return this.model.findOne({ customerId }).lean();
  }
}