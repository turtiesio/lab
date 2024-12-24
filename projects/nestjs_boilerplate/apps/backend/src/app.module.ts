import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import appConfig from './app.config';
import { AppDataSource } from './modules/database/dataSource';
import { LoggerModule } from './logger/logger.module';
import databaseConfig from './modules/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: AppDataSource.options.entities,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    LoggerModule,
  ],
})
export class AppModule {}
