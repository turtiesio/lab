import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import appConfig from './app.config';
import { LoggerModule } from './logger/logger.module';
import databaseConfig from './modules/database/database.config';
import { RequestLoggingMiddleware } from '@back/middlewares/request-logging.middleware';
import { HealthModule } from './modules/health/health.module';
import { AppController } from '@back/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database')!,
      inject: [ConfigService],
    }),
    UserModule,
    LoggerModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
