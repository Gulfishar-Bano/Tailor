import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  tailorId: string;

  @IsString()
  @IsNotEmpty()
  garmentType: string;

  @IsString()
  @IsNotEmpty()
  stitchingType: string;

  @IsString()
  @IsNotEmpty()
  style: string;

  @IsInt()
  @IsPositive()
  budgetMin: number;

  @IsInt()
  @IsPositive()
  budgetMax: number;

  @IsString()
  @IsOptional()
  occasion?: string;

  @IsString()
  @IsOptional()
  neckDesign?: string;

  @IsString()
  @IsOptional()
  sleeveType?: string;

  @IsString()
  @IsOptional()
  fit?: string;

  @IsString()
  @IsOptional()
  fabric?: string;

  @IsString()
  @IsOptional()
  fabricColor?: string;

  @IsBoolean()
  @IsOptional()
  embroidery?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsDateString()
  @IsNotEmpty()
  expectedDelivery: Date;
}