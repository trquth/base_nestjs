import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isEmpty, isNil, isString } from 'lodash';
import * as tmp from 'tmp';
import { resolve } from 'path';

@Injectable()
export class ExcelService {
  resourceRootPath = resolve(__dirname, '../../src/resources');
  // https://blog.tericcabrel.com/read-excel-file-nodejs-typescript/
  async readFile(data: string | Buffer) {
    try {
      if (isEmpty(data)) {
        throw new Error('Empty data');
      }
      const workbook = new Excel.Workbook();
      let content = null;
      if (isString(data)) {
        content = await workbook.xlsx.readFile(data);
      } else {
        content = await workbook.xlsx.load(data);
      }

      if (isNil(content)) {
        throw new Error('Cannot read file.');
      }

      const worksheets = content.worksheets;
      return { workbook, worksheets };
    } catch (error) {
      throw error;
    }
  }
  // https://wajihaabid.medium.com/downloading-data-in-excel-format-with-nest-js-4a0a859bf430
  async writeFile(workBook: Excel.Workbook, fileName: string) {
    try {
      const data = await tmp.fileSync({
        tmpdir: `${this.resourceRootPath}/report/`,
        prefix: `${fileName}-`,
        postfix: '.xlsx',
      });
      const file = data.name;
      if (file) {
        await workBook.xlsx.writeFile(file);
        return file;
      }
      return null;
      // tmp.file(
      //   {
      //     tmpdir: `${this.resourceRootPath}/report/`,
      //     prefix: `${fileName}-`,
      //     postfix: '.xlsx',
      //   },
      //   async (err, file) => {
      //     if (err) throw err;
      //     // console.log('PATH:::', file);
      //     await workBook.xlsx.writeFile(file);
      //     callback?.(file);
      //   },
      // );
    } catch (error) {
      throw error;
    }
  }
}
