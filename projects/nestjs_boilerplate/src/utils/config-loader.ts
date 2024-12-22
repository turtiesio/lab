import { ConfigFactory, registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export function configLoader<T extends object>(
  token: string,
  configClass: new () => T,
): ConfigFactory<T> {
  return registerAs(token, () => {
    const envConfig = process.env[token.toUpperCase()];
    const config = plainToInstance(configClass, {
      ...process.env,
      ...(typeof envConfig === 'object' && envConfig !== null ? envConfig : {}),
    });

    const errors = validateSync(config, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(
        `Configuration validation error in ${token}: ${errors.toString()}`,
      );
    }

    return config;
  }) as ConfigFactory<T>;
}
