import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthServiceImpl } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthServiceImpl],
})
export class HealthModule {}
