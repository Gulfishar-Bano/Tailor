import { IsOptional, IsString } from 'class-validator';

export class RejectOrderDto {
  @IsString()
  @IsOptional()
  adminNotes?: string;
}