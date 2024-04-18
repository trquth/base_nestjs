import { Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { isEmpty } from 'lodash';

@Injectable()
export class ExcelService {
  // https://blog.tericcabrel.com/read-excel-file-nodejs-typescript/
  async readFile(path: string) {
    try {
      if (isEmpty(path)) {
        throw new Error('Empty path');
      }
      const workbook = new Excel.Workbook();
      const content = await workbook.xlsx.readFile(path);
      const worksheets = content.worksheets;
      return worksheets;
    } catch (error) {
      throw error;
    }
  }

  async writeFile(path: string) {
    try {
      if (isEmpty(path)) {
        throw new Error('Empty path');
      }
      const workbook = new Excel.Workbook();
      const content = await workbook.xlsx.readFile(path);
      const worksheets = content.worksheets;
      return worksheets;
    } catch (error) {
      throw error;
    }
  }
}
