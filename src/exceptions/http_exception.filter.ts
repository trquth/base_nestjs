// https://levelup.gitconnected.com/error-handling-and-logging-in-nestjs-best-practices-ecc871ade7d7
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorException } from 'src/models/response/error_exception.model';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const error = exception.cause;

    response
      .status(status)
      .json(new ErrorException(status, message, request.url, `${error}`));
  }
}
