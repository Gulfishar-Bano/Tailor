import { Test, TestingModule } from '@nestjs/testing';
import { AdminCustomersService } from './admin-customers.service';

describe('AdminCustomersService', () => {
  let service: AdminCustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCustomersService],
    }).compile();

    service = module.get<AdminCustomersService>(AdminCustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
