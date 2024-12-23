import { configLoader } from '../utils/config-loader';
import { AppConfig } from './app.config.type';

const appConfig = configLoader<AppConfig>('app', AppConfig);

export default appConfig;
