import { registerAs } from '@nestjs/config';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { AppConfig } from './config.type';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;
}

export default registerAs<AppConfig>('config', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : undefined,
  };
});
