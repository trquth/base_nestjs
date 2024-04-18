import { Unit } from 'src/enums/unit.enum';

export class ProductModel {
  constructor(
    public id: string,
    public name: string,
    public unit: Unit | null,
    public quantity: number | null,
    public weight: number | null,
  ) {}
}
