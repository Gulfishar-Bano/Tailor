import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Register')
  Register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('Login')
  Login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

}
