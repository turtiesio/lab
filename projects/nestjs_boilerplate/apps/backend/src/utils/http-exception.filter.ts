import { MyLogger } from '@back/logger/logger.service';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { getReasonPhrase } from 'http-status-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: MyLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = getReasonPhrase(status);
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        errorDetails = exceptionResponse; // Capture details if available
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorDetails = exception.stack; // Log stack trace for internal errors
    }

    // Log errors
    this.logger.write(status >= 500 ? 'error' : 'info', message, {
      status,
      path: request.url,
      method: request.method,
      err: errorDetails,
    });

    // Send response
    response.status(status).json({
      statusCode: status,
      message: getReasonPhrase(status), //! No detailed message(for security reasons)
    });
  }
}
