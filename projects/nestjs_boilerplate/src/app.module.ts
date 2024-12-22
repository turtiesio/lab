import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './modules/database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './modules/database/database.config';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

console.log(
  `${process.cwd()}/.env.${process.env.NODE_ENV}`,
  `${process.cwd()}/.env`,
  `.env`,
  `.env.${process.env.NODE_ENV}`,
  `../.env`,
  `../.env.${process.env.NODE_ENV}`,
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: [`.env.local`],
    }),
    infrastructureDatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
