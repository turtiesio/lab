import { registerAs } from '@nestjs/config';
import { IsString, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { validateConfig } from '@back/utils/validate-config';

class RedisConfigValidator {
  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  REDIS_PASSWORD?: string;

  @IsNumber()
  REDIS_DB: number;
}

export default registerAs('redis', () => {
  validateConfig(process.env, RedisConfigValidator);

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  };
});
