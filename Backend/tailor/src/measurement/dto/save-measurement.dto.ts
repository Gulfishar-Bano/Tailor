// src/measurement/dto/save-measurement.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveMeasurementDto {
  @IsString() @IsNotEmpty()
  customerId: string;

  @IsNumber() @IsOptional() chest?: number;
  @IsNumber() @IsOptional() waist?: number;
  @IsNumber() @IsOptional() hip?: number;
  @IsNumber() @IsOptional() shoulder?: number;
  @IsNumber() @IsOptional() length?: number;
  @IsNumber() @IsOptional() sleeveLength?: number;
  @IsNumber() @IsOptional() neck?: number;
  @IsNumber() @IsOptional() inseam?: number;

  @IsString() @IsOptional()
  notes?: string;
}