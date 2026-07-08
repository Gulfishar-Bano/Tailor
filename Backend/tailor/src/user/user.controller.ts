import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateTailorDto } from './dto/update-tailor.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Get('tailor/list')
  async getAllTailors() {
    return this.userService.getAllTailors();
  }

  @Get('tailors/:id')
getTailorById(@Param('id') id: string) {
  return this.userService.getTailorById(id);
}

@Patch('tailors/:id')
updateTailor(
  @Param('id') id: string,
  @Body() updateTailorDto: UpdateTailorDto,
) {
  return this.userService.updateTailor(id, updateTailorDto);
}


@Get('tailors/experience/:experience')
getTailorsByExperience(
  @Param('experience') experience: number,
) {
  return this.userService.getTailorsByExperience(
    Number(experience),
  );
}


@Get('tailors/city/:city')
getTailorsByCity(
  @Param('city') city: string,
) {
  return this.userService.getTailorsByCity(
    String(city),
  );
}
 


  @Get('tailor/:id')
  getTailorProfile(@Param('id') id: string) {
    return this.userService.getTailorProfile(id);
  }
 
  // ADD to your existing UserController (wherever GET tailor/:id lives)

@Patch('tailor/:id/portfolio')
updatePortfolio(
  @Param('id') id: string,
  @Body('images') images: string[],
) {
  return this.userService.updatePortfolio(id, images);
}



 

 
 
}
