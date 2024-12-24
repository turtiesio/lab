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
}

// Config Type
export type AppConfig = {
  nodeEnv?: string;
  port?: number;
};

// Config Factory
export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV!,
    port: parseInt(process.env.APP_PORT!, 10),
  };
});
