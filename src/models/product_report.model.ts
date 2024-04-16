import { Unit } from 'src/models/product.model';

export class ProductReportModel {
  constructor(
    public trxNo: string,
    public name: string,
    public unit: Unit,
    public quantity: number,
    public price: number,
    public total: number,
  ) {}
}
