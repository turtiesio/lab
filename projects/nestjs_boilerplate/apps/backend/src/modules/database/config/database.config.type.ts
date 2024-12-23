import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => parseInt(value, 10))
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
  @Transform(({ value }) => value === 'true')
  DATABASE_SYNCHRONIZE?: boolean;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  DATABASE_MAX_CONNECTIONS?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  DATABASE_SSL_ENABLED?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
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
