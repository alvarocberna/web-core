import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = exception.getResponse?.();

    // normalizar message (string | string[] | {message: string | string[]})
    let message: string | string[] = 'Error inesperado';
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse && typeof errorResponse === 'object') {
      // common structures: { message: 'x' } or { message: ['a','b'] } or { error: 'Bad Request' }
      if ('message' in errorResponse) {
        message = (errorResponse as any).message;
      } else if ('error' in errorResponse) {
        message = (errorResponse as any).error;
      } else {
        message = JSON.stringify(errorResponse);
      }
    }

    // Log the exception (adjust as you need: Sentry, Datadog...)
    this.logger.error({
      status,
      message,
      path: request?.url,
      // in dev you might include stack:
      stack: (exception as any).stack,
    });

    const payload: any = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request?.url,
    };

    // Include more details in non-prod environments
    if (process.env.NODE_ENV !== 'production') {
      payload.exception = {
        name: exception.name,
        // if the exception.response had other props include them
        response: errorResponse,
      };
    }

    return response.status(status).json(payload);
  }
}
