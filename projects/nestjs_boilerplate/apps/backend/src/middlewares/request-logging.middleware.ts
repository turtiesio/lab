import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {
    this.logger.setContext(RequestLoggingMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      // TODO: add user, requestId, traceId, etc..

      this.logger.write('info', `${method} ${originalUrl} ${statusCode}`, {
        //   req,
        userAgent,
        statusCode,
        contentLength,
        ip,
      });
    });

    next();
  }
}
