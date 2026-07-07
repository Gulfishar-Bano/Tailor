import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Step 1: Check if email already exists
    const existingEmail = await this.userService.findByEmail(
      registerDto.email,
    );

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Step 2: Check if phone already exists
    const existingPhone = await this.userService.findByPhone(
      registerDto.phone,
    );

    if (existingPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    // Step 3: Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      10,
    );

    // Step 4: Create user object
    const userData = {
      ...registerDto,
      password: hashedPassword,
    };

    // Step 5: Save user
    const user = await this.userService.createUser(userData);

    // Step 6: Return response
    return {
      message: 'User registered successfully',
      user,
    };
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Step 1: Find user by email
    const user = await this.userService.findByEmail(email); 
    console.log('User found:', user); // Debugging line

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Step 2: Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    console.log('Password valid:', isPasswordValid); // Debugging line

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    // Step 3: Return user object (excluding password)
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name
      },
    };
  }
}