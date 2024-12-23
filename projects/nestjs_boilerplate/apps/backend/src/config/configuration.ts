import databaseConfig from '../modules/database/config/database.config';
import appConfig from './app.config';

export default async () => ({
  ...appConfig(),
  ...databaseConfig(),
});

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type Configuration = UnwrapPromise<ReturnType<typeof appConfig>> &
  UnwrapPromise<ReturnType<typeof databaseConfig>>;
