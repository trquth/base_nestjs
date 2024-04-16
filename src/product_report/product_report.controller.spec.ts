import { Test, TestingModule } from '@nestjs/testing';
import { ProductReportController } from './product_report.controller';

describe('ProductReportController', () => {
  let controller: ProductReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductReportController],
    }).compile();

    controller = module.get<ProductReportController>(ProductReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
