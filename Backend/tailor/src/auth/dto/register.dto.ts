import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Gender } from '../../common/enums/gender.enum'; 

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsInt()
  @Min(13)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  experience?: number;

  @IsOptional()
  city?: string;

  @IsOptional()
  specialization?: string;

  @IsOptional()
  bio?: string;
}