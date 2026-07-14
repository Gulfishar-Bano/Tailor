// src/doorstep/doorstep.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoorstepController } from './doorstep.controller';
import { DoorstepService } from './doorstep.service';
import { DoorstepRequest, DoorstepRequestSchema } from './schemas/doorstep-request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DoorstepRequest.name, schema: DoorstepRequestSchema }])],
  controllers: [DoorstepController],
  providers: [DoorstepService],
})
export class DoorstepModule {}