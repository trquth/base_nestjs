import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { ProductReportController } from './product_report/product_report.controller';

@Module({
  imports: [],
  controllers: [AppController, ProductsController, ProductReportController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
