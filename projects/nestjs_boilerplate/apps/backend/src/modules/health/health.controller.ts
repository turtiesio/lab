import { Controller, Get } from '@nestjs/common';
import { HealthServiceImpl } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthServiceImpl) {}

  @Get()
  checkHealth(): string {
    return this.healthService.check();
  }
}
