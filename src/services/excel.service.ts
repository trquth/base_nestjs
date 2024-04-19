import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isEmpty } from 'lodash';
import * as tmp from 'tmp';
import { resolve } from 'path';

@Injectable()
export class ExcelService {
  resourceRootPath = resolve(__dirname, '../../src/resources');
  // https://blog.tericcabrel.com/read-excel-file-nodejs-typescript/
  async readFile(path: string) {
    try {
      if (isEmpty(path)) {
        throw new Error('Empty path');
      }
      const workbook = new Excel.Workbook();
      const content = await workbook.xlsx.readFile(path);
      const worksheets = content.worksheets;
      return { workbook, worksheets };
    } catch (error) {
      throw error;
    }
  }
  // https://wajihaabid.medium.com/downloading-data-in-excel-format-with-nest-js-4a0a859bf430
  async writeFile(workBook: Excel.Workbook, fileName: string) {
    try {
      tmp.file(
        {
          tmpdir: `${this.resourceRootPath}/report/`,
          prefix: `${fileName}-`,
          postfix: '.xlsx',
        },
        async (err, file) => {
          if (err) throw err;
          // console.log('PATH:::', file);
          await workBook.xlsx.writeFile(file);
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
