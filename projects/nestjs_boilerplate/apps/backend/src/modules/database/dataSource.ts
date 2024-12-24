import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const AppDataSource = new DataSource({
  type: (process.env.DATABASE_TYPE || 'postgres') as
    | 'postgres'
    | 'mysql'
    | 'mariadb'
    | 'cockroachdb'
    | 'sqlite'
    | 'mssql',
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!, 10),
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  migrationsRun: true,
} as DataSourceOptions);
