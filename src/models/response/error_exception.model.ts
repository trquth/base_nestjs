export class ErrorException {
  public statusCode: number;
  public path: string;
  public message: string;
  public date: string;
  public error: string;
  constructor(
    statusCode: number,
    message: string,
    path: string,
    error: string,
  ) {
    this.date = new Date().toISOString();
    this.statusCode = statusCode;
    this.path = path;
    this.message = message;
    this.error = error;
  }
}
