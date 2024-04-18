import { Unit } from 'src/enums/unit.enum';

export class ProductNewReportModel {
  constructor(
    public weight: number | null,
    public trxNo: string,
    public name: string,
    public unit: Unit,
    public buyingQuantity: number,
    public quantity: number,
    public price: number,
    public total: number,
    public totalWeight: number | null,
    public boxNumber: number | null,
    public itemNumber: number | null,
  ) {}
}
