import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

function transformValue(
  value: string | undefined,
  type: 'number' | 'boolean',
): number | boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (type === 'number') {
    return Number(value);
  }
  if (type === 'boolean') {
    return value === 'true';
  }
  return undefined;
}

export class DatabaseConfig {
  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

  @IsString()
  @IsOptional()
  DATABASE_TYPE?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => transformValue(value, 'number'))
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformValue(value, 'boolean'))
  DATABASE_SYNCHRONIZE?: boolean;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => transformValue(value, 'number'))
  DATABASE_MAX_CONNECTIONS?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformValue(value, 'boolean'))
  DATABASE_SSL_ENABLED?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => transformValue(value, 'boolean'))
  DATABASE_REJECT_UNAUTHORIZED?: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA?: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY?: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT?: string;
}
