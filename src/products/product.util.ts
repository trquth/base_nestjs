import { Unit } from '../models/product.model';

export class ProductUtil {
  static convertUnit(param: string) {
    let unit: Unit | null;
    switch (param.toUpperCase()) {
      case 'Hộp'.toUpperCase():
        unit = Unit.box;
        break;
      case 'Túi'.toUpperCase():
        unit = Unit.bag;
        break;
      case 'Chai'.toUpperCase():
        unit = Unit.bottle;
        break;
      case 'Cái'.toUpperCase():
        unit = Unit.package;
        break;
      case 'Lẻ'.toUpperCase():
        unit = Unit.item;
        break;
      default:
        break;
    }
    return unit;
  }
}
