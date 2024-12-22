import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const config = await databaseConfig();
    return {
      type: config.DATABASE_TYPE || 'postgres',
      url: config.DATABASE_URL,
      host: config.DATABASE_HOST,
      port: config.DATABASE_PORT,
      username: config.DATABASE_USERNAME,
      password: config.DATABASE_PASSWORD,
      database: config.DATABASE_NAME,
      synchronize: config.DATABASE_SYNCHRONIZE,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: process.env.NODE_ENV !== 'production',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        subscribersDir: 'subscriber',
      },
      extra: {
        max: config.DATABASE_MAX_CONNECTIONS,
        ssl: config.DATABASE_SSL_ENABLED
          ? {
              rejectUnauthorized: config.DATABASE_REJECT_UNAUTHORIZED,
              ca: config.DATABASE_CA,
              key: config.DATABASE_KEY,
              cert: config.DATABASE_CERT,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
