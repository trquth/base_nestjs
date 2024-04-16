import { Controller, Get, NotImplementedException } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isArray, isNil, isNumber, isString } from 'lodash';
import { resolve } from 'path';
import { Unit } from 'src/models/product.model';
import { ProductReportModel } from 'src/models/product_report.model';
import { ProductUtil } from 'src/products/product.util';
import { NumberUtil } from 'src/utils/number.util';

@Controller('product-report')
export class ProductReportController {
  filePath = resolve(__dirname, '../../src/resources/excels/HANG.xlsx');

  @Get()
  async getProducts() {
    try {
      const workbook = new Excel.Workbook();
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
      const report: ProductReportModel[] = [];
      rows.forEach((row) => {
        if (row.cellCount >= 13) {
          const row1stValue = row.getCell(1).value;
          const isNoNumber = NumberUtil.isNumeric(row1stValue);
          if (isNoNumber) {
            const row2ndValue = row.getCell(2).value;

            const isTrxNo =
              isString(row2ndValue) &&
              (row2ndValue.length >= 5 || row2ndValue.length <= 9);
            if (isTrxNo) {
              let trxNo: string | null;
              let name: string | null;
              let unit: Unit | null;
              let quantity: number | null;
              let price: number | null;
              let total: number | null;
              row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
                console.log(
                  'Cell ' +
                    colNumber +
                    ' = ' +
                    cell.value +
                    'type = ' +
                    typeof cell.value,
                );
                switch (colNumber) {
                  case 2:
                    if (isString(cell.value)) {
                      trxNo = cell.value;
                    }
                    break;
                  case 4:
                    if (isString(cell.value)) {
                      name = cell.value;
                    }
                    break;
                  case 6:
                    if (isString(cell.value)) {
                      unit = ProductUtil.convertUnit(cell.value);
                    }
                    break;
                  case 10:
                    if (isNumber(cell.value)) {
                      quantity = cell.value;
                    }
                    break;
                  case 11:
                    if (isNumber(cell.value)) {
                      price = cell.value;
                    }
                    break;
                  case 13:
                    if (isNumber(cell.value)) {
                      total = cell.value;
                    }
                    break;
                  default:
                    break;
                }
              });
              const product = new ProductReportModel(
                trxNo,
                name,
                unit,
                quantity,
                price,
                total,
              );
              report.push(product);
            }
          }
        }
      });
      return report;
    } catch (error) {
      console.log('ERROR', error);
    }
  }

  @Get()
  async getQuantityTotalOfReport() {}

  @Get()
  async getTotalPayOfReport() {}
}
