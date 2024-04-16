import { Controller, Get, NotImplementedException } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isArray, isNil, isNumber, isString } from 'lodash';
import { resolve } from 'path';
import { ProductModel, Unit } from './product.model';

@Controller('products')
export class ProductsController {
  filePath = resolve(__dirname, '../../src/resources/excels/XE_TRANG.xlsx');

  @Get()
  async getProducts() {
    try {
      const workbook = new Excel.Workbook();
      console.log('path', this.filePath);
      const content = await workbook.xlsx.readFile(this.filePath);
      const worksheets = content.worksheets;
      if (!isArray(worksheets) || isNil(worksheets[0])) {
        throw new NotImplementedException();
      }
      // https://blog.tericcabrel.com/read-excel-file-nodejs-typescript/
      const worksheet = worksheets[0];
      const rowStartIndex = 3;
      const numberOfRows = worksheet.rowCount;
      const rows = worksheet.getRows(rowStartIndex, numberOfRows) ?? [];
      const products: ProductModel[] = [];
      rows.forEach((row) => {
        let id: string | null;
        let name: string | null;
        let unit: Unit | null;
        let quantity: number | null;

        row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
          console.log('Cell ' + colNumber + ' = ' + cell.value);
          switch (colNumber) {
            case 1:
              if (isString(cell.value)) {
                id = cell.value;
              }
              break;
            case 2:
              if (isString(cell.value)) {
                name = cell.value;
              }
              break;
            case 8:
              if (isString(cell.value)) {
                //Hộp, Túi, Chai, Cái, Lẻ
                switch (cell.value) {
                  case 'Hộp':
                    unit = Unit.box;
                    break;
                  case 'Túi':
                    unit = Unit.bag;
                    break;
                  case 'Chai':
                    unit = Unit.bottle;
                    break;
                  case 'Cái':
                    unit = Unit.package;
                    break;
                  case 'Lẻ':
                    unit = Unit.item;
                    break;
                  default:
                    break;
                }
              }
              break;
            case 9:
              if (isNumber(cell.value)) {
                quantity = cell.value;
              }
              break;
            default:
              break;
          }
        });
        if (!isNil(id) && !isNil(name)) {
          const product = new ProductModel(id, name, unit, quantity);
          products.push(product);
        }
      });
      return products;
    } catch (error) {
      console.log('ERROR', error);
    }
  }
}
