import databaseConfig from '../modules/database/database.config';
import { configLoader } from '../utils/config-loader';
import { AppConfig } from '../app.config';

const appConfigFactory = configLoader<AppConfig>('app', AppConfig);

export default () => ({
  ...appConfigFactory(),
  ...databaseConfig(),
});
