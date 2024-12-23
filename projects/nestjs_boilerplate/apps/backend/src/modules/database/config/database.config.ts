import { configLoader } from '../../../utils/config-loader';
import { DatabaseConfig } from './database.config.type';

export default configLoader<DatabaseConfig>('database', DatabaseConfig);
