import {
  BadRequestException,
  Controller,
  Get,
  UseFilters,
} from '@nestjs/common';
import { resolve } from 'path';
import { HttpExceptionFilter } from 'src/exceptions/http_exception.filter';
import { ProductReportService } from 'src/services/product_report.service';

@Controller('product-report')
@UseFilters(new HttpExceptionFilter())
export class ProductReportController {
  constructor(private readonly productReportService: ProductReportService) {}
  filePath = resolve(__dirname, '../../src/resources/excels/HANG.xlsx');

  @Get()
  async getProducts() {
    try {
      return await this.productReportService.makeNewProductsReport(
        this.filePath,
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong during read file', {
        cause: error,
      });
    }
  }

  @Get()
  async getQuantityTotalOfReport() {}

  @Get()
  async getTotalPayOfReport() {}
}
