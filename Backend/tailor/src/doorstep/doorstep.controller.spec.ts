import { Test, TestingModule } from '@nestjs/testing';
import { DoorstepController } from './doorstep.controller';
import { DoorstepService } from './doorstep.service';

describe('DoorstepController', () => {
  let controller: DoorstepController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoorstepController],
      providers: [DoorstepService],
    }).compile();

    controller = module.get<DoorstepController>(DoorstepController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
