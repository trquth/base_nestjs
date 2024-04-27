import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isNil } from 'lodash';
import { resolve } from 'path';
import { HttpExceptionFilter } from 'src/exceptions/http_exception.filter';
import { ProductReportService } from 'src/services/product_report.service';

@Controller('product-report')
@UseFilters(new HttpExceptionFilter())
export class ProductReportController {
  constructor(private readonly productReportService: ProductReportService) {}
  filePath = resolve(__dirname, '../../src/resources/excels/HANG.xlsx');

  // https://stackoverflow.com/questions/75834365/upload-excel-file-using-nestjs-and-typescript
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'file',
        maxCount: 1,
      },
    ]),
  )
  async uploadFile(@UploadedFiles() files: { file: Express.Multer.File[] }) {
    try {
      console.log(files);

      if (isNil(files.file) || files.file.length === 0) {
        throw new Error('Missing file. Please check again.');
      }
      const data = await this.productReportService.makeNewProductsReport(
        files.file[0].buffer,
      );
      return await this.productReportService.exportReportExcel(data);
    } catch (error) {
      console.log('xxxx ERROR xxxxx', error);
      throw new BadRequestException('Something went wrong during export file', {
        cause: error,
      });
    }
  }

  @Get()
  async getQuantityTotalOfReport() {}

  @Get()
  async getTotalPayOfReport() {}
}
