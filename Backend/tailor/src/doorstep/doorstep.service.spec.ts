import { Test, TestingModule } from '@nestjs/testing';
import { DoorstepService } from './doorstep.service';

describe('DoorstepService', () => {
  let service: DoorstepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoorstepService],
    }).compile();

    service = module.get<DoorstepService>(DoorstepService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
