import { Test, TestingModule } from '@nestjs/testing';
import { AdminCustomersController } from './admin-customers.controller';
import { AdminCustomersService } from './admin-customers.service';

describe('AdminCustomersController', () => {
  let controller: AdminCustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminCustomersController],
      providers: [AdminCustomersService],
    }).compile();

    controller = module.get<AdminCustomersController>(AdminCustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
