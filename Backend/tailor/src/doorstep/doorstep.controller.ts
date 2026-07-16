// src/doorstep/doorstep.controller.ts
import { Body, Controller, Get, Post,Param } from '@nestjs/common';
import { DoorstepService } from './doorstep.service';
import { CreateDoorstepRequestDto } from './Dto/create-doorstep-request.dto';

@Controller('doorstep-requests')
export class DoorstepController {
  constructor(private readonly doorstepService: DoorstepService) {}

  @Post()
  create(@Body() dto: CreateDoorstepRequestDto) {
    return this.doorstepService.create(dto);
  }

  @Get()
  findAll() {
    return this.doorstepService.findAll();
  }

    @Get('customer/:customerId')
  getByCustomer(@Param('customerId') customerId: string) {
    return this.doorstepService.getLatestByCustomer(customerId);
  }
}