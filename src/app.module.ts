import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './services/products.service';
import { ProductReportController } from './product_report/product_report.controller';
import { ExcelService } from './services/excel.service';
import { ProductReportService } from './services/product_report.service';

@Module({
  imports: [],
  controllers: [AppController, ProductsController, ProductReportController],
  providers: [AppService, ProductsService, ExcelService, ProductReportService],
})
export class AppModule {}
