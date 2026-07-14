// src/doorstep/doorstep.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoorstepRequest, DoorstepRequestDocument } from './schemas/doorstep-request.schema';
import { CreateDoorstepRequestDto } from './Dto/create-doorstep-request.dto';

@Injectable()
export class DoorstepService {
  constructor(
    @InjectModel(DoorstepRequest.name) private model: Model<DoorstepRequestDocument>,
  ) {}

  create(dto: CreateDoorstepRequestDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().populate('customerId', 'name phone').sort({ createdAt: -1 }).lean();
  }
}