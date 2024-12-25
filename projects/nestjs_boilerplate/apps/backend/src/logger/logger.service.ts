import { Injectable, Scope, Inject, LoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger implements LoggerService {
  private logger: Logger;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const isProduction = this.configService.get('app.nodeEnv') === 'production';

    this.logger = pino({
      level: isProduction ? 'info' : 'trace',
      transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'SYS:standard',
            },
          },
      redact: {
        paths: ['req.headers.authorization', '*.password'],
        censor: '********',
      },
    });
  }

  setContext(context: string): MyLogger {
    this.logger = this.logger.child({ context });
    return this;
  }

  log(message: any, ...optionalParams: any[]) {
    this.callLogger('info', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.callLogger('error', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.callLogger('warn', message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.callLogger('debug', message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.callLogger('trace', message, optionalParams);
  }

  write(
    level: 'info' | 'error' | 'warn' | 'debug' | 'trace',
    message: string,
    object?: Record<string, unknown>,
  ) {
    this.logger[level](object, message);
  }

  private callLogger(
    level: 'info' | 'error' | 'warn' | 'debug' | 'trace',
    message: any,
    optionalParams: any[],
  ) {
    if (optionalParams.length > 0) {
      this.logger[level](optionalParams, message);
    } else {
      this.logger[level](message);
    }
  }
}
