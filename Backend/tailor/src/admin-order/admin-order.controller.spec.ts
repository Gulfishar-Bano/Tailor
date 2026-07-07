import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrderController } from './admin-order.controller';
import { AdminOrderService } from './admin-order.service';

describe('AdminOrderController', () => {
  let controller: AdminOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminOrderController],
      providers: [AdminOrderService],
    }).compile();

    controller = module.get<AdminOrderController>(AdminOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
