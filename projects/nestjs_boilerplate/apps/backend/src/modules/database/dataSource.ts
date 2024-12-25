import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const dataSourceConfig: DataSourceOptions = {
  type: process.env.DATABASE_TYPE! as 'postgres',
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  entities: [__dirname + '/../../**/*.schema{.ts,.js}'],
  migrations: [__dirname + '/../../../migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: true,
};

export const AppDataSource = new DataSource(dataSourceConfig);
