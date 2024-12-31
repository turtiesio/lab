import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        storage: new Redis({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
        }),
        throttlers: [
          {
            ttl: 60, // 1 minute
            limit: 100, // 100 requests per minute
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ApiThrottlerModule {}
