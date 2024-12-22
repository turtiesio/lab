import { DatabaseConfig } from 'src/modules/database/database.config.type';
import { AppConfig } from './config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};
