import { Module } from '@nestjs/common';
import { HealthControllerV1 } from './health.controller.v1';
import { HealthServiceImpl } from './health.service';

@Module({
  controllers: [HealthControllerV1],
  providers: [HealthServiceImpl],
})
export class HealthModule {}
