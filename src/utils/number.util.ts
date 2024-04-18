export class NumberUtil {
  static isNumeric = (num: any) =>
    (typeof num === 'number' ||
      (typeof num === 'string' && num.trim() !== '')) &&
    !isNaN(num as number);

  static round = (number: number, point: number = 6) =>
    Math.round(number * Math.pow(10, point)) / Math.pow(10, point);
}
