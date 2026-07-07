import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class SubmitTailorQuoteDto {
  @IsString()
  @IsNotEmpty()
  tailorId: string; // used to verify ownership, not yet from an auth token

  @IsInt()
  @IsPositive()
  tailorQuote: number;
}