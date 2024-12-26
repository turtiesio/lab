import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { validateConfig } from '@back/utils/validate-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

// Validation Class
class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_DOMAIN: string;
}

// Config Type
export type AppConfig = {
  nodeEnv: string;
  port: number;

  backendDomain: string;
  frontendDomain: string;
};

// Config Factory
export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV!,
    port: parseInt(process.env.APP_PORT || '3000', 10),

    backendDomain: process.env.BACKEND_DOMAIN || 'http://localhost:3000',
    frontendDomain: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
  };
});
