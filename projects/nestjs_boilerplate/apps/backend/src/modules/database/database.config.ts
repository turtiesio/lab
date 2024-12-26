import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { validateConfig } from '@back/utils/validate-config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Validation Class
class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsOptional()
  @IsString()
  DATABASE_USERNAME?: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsOptional()
  @IsString()
  DATABASE_PASSWORD?: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  DATABASE_MAX_CONNECTIONS?: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED?: boolean;
}

type DatabaseConfig = {} & TypeOrmModuleOptions;

// Config Factory
export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  const config: DatabaseConfig = {
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    //
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL_ENABLED === 'true',
    poolSize: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100, // Connection pool size
  };

  return config;
});
