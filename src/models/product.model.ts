//Hộp, Túi, Chai, Cái, Lẻ
export enum Unit {
  item = 'item', //Lẻ
  package = 'package', //Cái
  bottle = 'bottle', //Chai
  bag = 'bag', //Túi
  box = 'box', //Hộp
}
export class ProductModel {
  constructor(
    public id: string,
    public name: string,
    public unit: Unit | null,
    public quantity: number | null,
  ) {}
}
