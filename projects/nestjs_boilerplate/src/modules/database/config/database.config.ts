import { configLoader } from '../../../utils/config-loader';
import { DatabaseConfig } from './database.config.type';

const databaseConfig = configLoader<DatabaseConfig>('database', DatabaseConfig);

export default databaseConfig;
