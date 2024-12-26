import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: MyLogger) {
    this.logger.setContext(RequestLoggingMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.write(
        'info',
        `${req.method} ${req.originalUrl} ${req.statusCode}`,
        {
          request: {
            hostname: req.hostname,
            baseUrl: req.baseUrl,
            url: req.url,
            ip: req.ip,
            method: req.method,
            params: req.params,
            query: req.query,
            cookies: req.cookies,
          },
          resposne: {
            statusCode: res.statusCode,
            contentType: res.get('content-type'),
            contentLength: res.get('content-length'),
          },
        },
      );
    });

    next();
  }
}
