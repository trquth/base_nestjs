import { Unit } from 'src/enums/unit.enum';

export class ProductReportModel {
  constructor(
    public trxNo: string,
    public name: string,
    public unit: Unit,
    public buyingQuantity: number,
    public price: number,
    public total: number,
  ) {}
}
