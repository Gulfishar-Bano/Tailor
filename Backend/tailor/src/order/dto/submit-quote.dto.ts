import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class SubmitQuoteDto {
  @IsInt()
  @IsPositive()
  tailorQuote: number;

  @IsInt()
  @IsPositive()
  adminMargin: number;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}