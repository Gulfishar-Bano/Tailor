import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateTailorDto {


 @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  password: string;

  
  @IsOptional()
 
  experience?: number;

  
  @IsOptional()
 
  city?: string;

  @IsOptional()
  specialization?: string;

  @IsOptional()
  
  bio?: string;
}