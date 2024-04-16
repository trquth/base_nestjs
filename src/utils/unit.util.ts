import { Unit } from 'src/models/product.model';

export class UnitUtil {
  static convertUnit(param: string) {
    let unit: Unit | null;
    switch (param) {
      case 'Hộp':
        unit = Unit.box;
        break;
      case 'Túi':
        unit = Unit.bag;
        break;
      case 'Chai':
        unit = Unit.bottle;
        break;
      case 'Cái':
        unit = Unit.package;
        break;
      case 'Lẻ':
        unit = Unit.item;
        break;
      default:
        break;
    }
    return unit;
  }
}
