import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isEmpty, isNil, isString } from 'lodash';
import * as tmp from 'tmp';
import { resolve } from 'path';

@Injectable()
export class ExcelService {
  resourceRootPath = resolve(__dirname, '../../../../src/resources');
  private workbook: Excel.Workbook;
  constructor() {
    this.workbook = new Excel.Workbook();
  }
  // https://blog.tericcabrel.com/read-excel-file-nodejs-typescript/
  async readFile(data: string | Buffer) {
    try {
      if (isEmpty(data)) {
        throw new Error('Empty data');
      }
      let content: Excel.Workbook | null = null;
      if (isString(data)) {
        content = await this.workbook.xlsx.readFile(data);
      } else {
        content = await this.workbook.xlsx.load(data);
      }

      if (isNil(content)) {
        throw new Error('Cannot read file.');
      }

      const worksheets: Excel.Worksheet[] = content.worksheets;
      return { workbook: this.workbook, worksheets };
    } catch (error) {
      throw error;
    }
  }
  // https://wajihaabid.medium.com/downloading-data-in-excel-format-with-nest-js-4a0a859bf430
  async writeFile(fileName: string) {
    try {
      const data = await tmp.fileSync({
        tmpdir: `${this.resourceRootPath}/report/`,
        template: `${fileName}_XXXXXX.xlsx`,
        // prefix: `${fileName}_`,
        // postfix: '.xlsx',
      });
      const file = data.name;
      if (file) {
        await this.workbook.xlsx.writeFile(file);
        return file;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async writeExcelBuffer() {
    try {
      // const data = await tmp.fileSync({
      //   tmpdir: `${this.resourceRootPath}/report/`,
      //   prefix: `${fileName}-`,
      //   postfix: '.xlsx',
      // });
      // const file = data.name;
      const buffer = await this.workbook.xlsx.writeBuffer();
      return buffer as Buffer;
    } catch (error) {
      throw error;
    }
  }
  // https://github.com/exceljs/exceljs/issues/333
  // makeBorderRow(
  //   worksheet: Excel.Worksheet,
  //   [startCol, startRow]: [number, number],
  //   [endCol, endRow]: [number, number],
  //   style: Excel.BorderStyle = 'thin',
  // ) {
  //   for (let i = startRow; i <= endRow; i++) {
  //     const leftBorderCell = worksheet.getCell(i, startCol);
  //     const rightBorderCell = worksheet.getCell(i, endCol);

  //     leftBorderCell.border = {
  //       ...leftBorderCell.border,
  //       left: {
  //         style,
  //       },
  //     };

  //     rightBorderCell.border = {
  //       ...rightBorderCell.border,
  //       right: {
  //         style,
  //       },
  //     };
  //   }

  //   for (let i = startCol; i <= endCol; i++) {
  //     const topBorderCell = worksheet.getCell(startRow, i);
  //     const bottomBorderCell = worksheet.getCell(endRow, i);

  //     topBorderCell.border = {
  //       ...topBorderCell.border,
  //       top: {
  //         style,
  //       },
  //     };

  //     bottomBorderCell.border = {
  //       ...bottomBorderCell.border,
  //       bottom: {
  //         style,
  //       },
  //     };
  //   }
  // }
}
