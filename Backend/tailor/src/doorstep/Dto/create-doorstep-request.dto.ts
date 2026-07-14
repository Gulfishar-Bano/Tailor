// src/doorstep/dto/create-doorstep-request.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDoorstepRequestDto {
  @IsString() @IsNotEmpty()
  customerId: string;

  @IsString() @IsNotEmpty()
  address: string;

  @IsString() @IsNotEmpty()
  preferredDate: string;

  @IsString() @IsNotEmpty()
  preferredTime: string;

  @IsString() @IsOptional()
  notes?: string;
}