import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schema/user.schema';

import { RegisterDto } from '../auth/dto/register.dto';
import { Role } from '../common/enums/role.enum';
import { UpdateTailorDto } from './dto/update-tailor.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}


async findByEmail(email: string) {
  return this.userModel.findOne({ email });
}

async findByPhone(phone: string) {
  return this.userModel.findOne({ phone });
}

async createUser(registerDto: RegisterDto) {
  const user = new this.userModel(registerDto);
  return user.save();
}
async getAllTailors() {
  return this.userModel
    .find({ role: Role.TAILOR })
    .select('-password');
}

async getTailorById(id: string) {
  return this.userModel
    .findOne({
      _id: id,
      role: Role.TAILOR,
    })
    .select('-password');
}

async updateTailor(
  id: string,
  dto: UpdateTailorDto,
) {
  return this.userModel.findOneAndUpdate(
    {
      _id: id,
      role: Role.TAILOR,
    },
    dto,
    {
      new: true,
    },
  );
}

async getTailorsByExperience(
  experience: number,
) {
  return this.userModel.find({
    role: Role.TAILOR,
    experience: {
      $gte: experience,
    },
  });
}


async getTailorsByCity(
  city: string,
) {
  return this.userModel.find({
    role: Role.TAILOR,
    city: {
      $regex: city,
      $options: 'i'
    },
  });
}


  async getTailorProfile(id: string) {
    const tailor = await this.userModel.findById(id).lean();
    if (!tailor) {
      throw new NotFoundException('Tailor not found');
    }
    // strip the password before sending to the frontend
    const { password, ...safeTailor } = tailor;
    return safeTailor;
  }
    


}


