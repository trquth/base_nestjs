import { Injectable } from '@nestjs/common';
import { ProductReportModel } from 'src/models/product_report.model';
import { ExcelService } from './excel.service';
import { NumberUtil } from 'src/utils/number.util';
import { isNumber, isString } from 'lodash';
import { Unit } from 'src/enums/unit.enum';
import { ProductUtil } from 'src/products/product.util';
import { ProductsService } from './products.service';
import { ProductNewReportModel } from 'src/models/product_new_report.model';
import { resolve } from 'path';
import * as moment from 'moment';
@Injectable()
export class ProductReportService {
  path = resolve(__dirname, '../../src/resources/templates');
  templateFilePath = `${this.path}/DON_HANG_TONG_TEMPLATE.xlsx`;

  constructor(
    private readonly excelService: ExcelService,
    private readonly productsService: ProductsService,
  ) {}

  async getExportedProductsData(data: Buffer) {
    try {
      const { worksheets } = await this.excelService.readFile(data);
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
              let buyingQuantity: number | null;
              let price: number | null;
              let total: number | null;
              row.eachCell({ includeEmpty: false }, function (cell, colNumber) {
                // console.log(
                //   'Cell ' +
                //     colNumber +
                //     ' = ' +
                //     cell.value +
                //     'type = ' +
                //     typeof cell.value,
                // );
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
                      buyingQuantity = cell.value;
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
                buyingQuantity,
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
      throw error;
    }
  }

  async makeNewProductsReport(data: Buffer) {
    try {
      const products = await this.productsService.getProducts();
      const reportedProducts = await this.getExportedProductsData(data);

      const newReport: ProductNewReportModel[] = [];

      reportedProducts.forEach((item) => {
        const product = products.find((p) => p.id === item.trxNo);
        if (product) {
          let boxNumber = null;
          let itemNumber = null;
          const number = item.buyingQuantity;
          // console.log(
          //   `xxxxx id:: ${item.trxNo} ::: buying quantity  ${item.buyingQuantity}
          //   xxxxxxx product quantity ${product.quantity}`,
          // );
          if (number) {
            if (item.buyingQuantity >= product.quantity) {
              boxNumber = item.buyingQuantity / product.quantity;
              const itemsCount = Math.floor(
                item.buyingQuantity % product.quantity,
              );
              if (itemsCount !== 0) {
                itemNumber = itemsCount;
              }
            } else {
              itemNumber = item.buyingQuantity;
            }
          }
          let totalWeight = null;
          let itemWeight = null;
          if (product.weight) {
            itemWeight = product.weight / product.quantity;
          }
          totalWeight = NumberUtil.round(item.buyingQuantity * itemWeight);
          const temp = new ProductNewReportModel(
            product.weight,
            item.trxNo,
            item.name,
            item.unit,
            item.buyingQuantity,
            product.quantity,
            item.price,
            item.total,
            totalWeight,
            boxNumber,
            itemNumber,
          );
          newReport.push(temp);
        }
      });
      return newReport;
    } catch (error) {
      throw error;
    }
  }
  // https://stackoverflow.com/questions/55132760/creating-excel-file-and-writing-to-it-with-exceljs
  async exportReportExcel(data: ProductNewReportModel[]) {
    try {
      const { workbook, worksheets } = await this.excelService.readFile(
        this.templateFilePath,
      );

      const worksheet = worksheets[0];
      //Title
      const firstRow = worksheet.getRow(1);
      const firstRowValue = firstRow.getCell(1).value;
      let title = '';
      if (isString(firstRowValue)) {
        title = firstRowValue.replace(
          '{DD/MM/YYYY}',
          moment(new Date()).format('DD/MM/YYYY'),
        );
      }
      firstRow.getCell(1).value = title;
      //Rows
      const rows = data.map((item) => [
        item.trxNo,
        item.name,
        item.boxNumber ?? '-',
        item.itemNumber ?? '-',
        item.totalWeight,
        item.quantity,
      ]);
      worksheet.insertRows(3, rows);
      return await this.excelService.writeFile(
        workbook,
        `DON_HANG_TONG_${Date.now()}`,
      );
    } catch (error) {
      throw error;
    }
  }
}
