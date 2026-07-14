// src/measurement/measurement.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeasurementService } from './measurement.service';
import { SaveMeasurementDto } from './dto/save-measurement.dto';

@Controller('measurements')
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Post()
  save(@Body() dto: SaveMeasurementDto) {
    return this.measurementService.save(dto);
  }

  @Get('customer/:customerId')
  getByCustomer(@Param('customerId') customerId: string) {
    return this.measurementService.getByCustomer(customerId);
  }
}