// src/measurement/measurement.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './measurement.service';
import { Measurement, MeasurementSchema } from './schemas/measurement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Measurement.name, schema: MeasurementSchema }])],
  controllers: [MeasurementController],
  providers: [MeasurementService],
  exports: [MeasurementService], // so AdminModule can reuse this later
})
export class MeasurementModule {}