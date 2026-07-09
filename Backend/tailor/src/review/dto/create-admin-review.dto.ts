import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAdminReviewDto {
  @IsString()
  @IsNotEmpty()
  tailorId: string;

  @IsString()
  @IsOptional()
  customerName?: string; // e.g. "Priya S." — collected by phone, no real account needed

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}