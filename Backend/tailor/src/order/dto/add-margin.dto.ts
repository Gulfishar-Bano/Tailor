import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class AddMarginDto {
  @IsInt()
  @IsPositive()
  adminMargin: number;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}