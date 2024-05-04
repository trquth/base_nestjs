import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './services/products.service';
import { ProductReportController } from './product_report/product_report.controller';
import { ExcelService } from './core/services/excel/excel.service';
import { ProductReportService } from './services/product_report.service';
import { GoogleDriveModule } from './core/services';

@Module({
  imports: [
    // GoogleDriveModule.register({
    //   clientId:
    //     '481962061394-or8itqcscc01j3fkdv0cogsfp6dfddna.apps.googleusercontent.com',
    //   clientSecret: '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',
    //   redirectUrl: 'https://developers.google.com/oauthplayground',
    //   refreshToken:
    //     '1//04awxLfQBSa8QCgYIARAAGAQSNwF-L9IrIJU806l6Po_NRfpB5rLvulODKw3YrT-nWszmD9jb4THqAN3LSseoZfZTtxjOhWPlTAo',
    // }),
  ],
  controllers: [AppController, ProductsController, ProductReportController],
  providers: [AppService, ProductsService, ExcelService, ProductReportService],
})
export class AppModule {}
