import { Injectable } from '@nestjs/common';
import { ProductModel } from 'src/models/product.model';
import { Unit } from 'src/enums/unit.enum';
import { isNil, isNumber, isObject, isString } from 'lodash';
import { UnitUtil } from 'src/utils/unit.util';
import { resolve } from 'path';
import { NumberUtil } from 'src/utils/number.util';
import { ExcelService } from 'src/core/services/excel/excel.service';

@Injectable()
export class ProductsService {
  filePath = resolve(__dirname, '../../src/resources/excels/XE_TRANG.xlsx');

  constructor(private readonly excelService: ExcelService) {}

  async getProducts() {
    try {
      const { worksheets } = await this.excelService.readFile(this.filePath);
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
        let weight: number | null;

        row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
          // console.log('Cell ' + colNumber + ' = ' + cell.value);
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
                unit = UnitUtil.convertUnit(cell.value);
              }
              break;
            case 9:
              if (isNumber(cell.value)) {
                quantity = cell.value;
              }
              break;
            case 11:
              if (isNumber(cell.value)) {
                weight = cell.value;
              } else if (isObject(cell.value)) {
                const result = row.getCell(11).result;

                if (NumberUtil.isNumeric(result)) {
                  weight = NumberUtil.round(parseFloat(result as string), 5);
                }
              }
              break;
            default:
              break;
          }
        });
        if (!isNil(id) && !isNil(name)) {
          const product = new ProductModel(id, name, unit, quantity, weight);
          products.push(product);
        }
      });
      return products;
    } catch (error) {
      throw error;
    }
  }
}
