import {
  BadRequestException,
  Controller,
  Get,
  UseFilters,
} from '@nestjs/common';
import { ProductsService } from 'src/services/products.service';
import { HttpExceptionFilter } from 'src/exceptions/http_exception.filter';

@Controller('products')
@UseFilters(new HttpExceptionFilter())
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getProducts() {
    try {
      const data = await this.productService.getProducts();
      return data;
    } catch (error) {
      throw new BadRequestException('Something went wrong during read file', {
        cause: error,
      });
    }
  }
}
