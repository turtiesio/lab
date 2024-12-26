import { Controller, Get } from '@nestjs/common';
import { HealthServiceImpl } from './health.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthControllerV1 {
  constructor(private healthService: HealthServiceImpl) {}

  @Get()
  @ApiOperation({ summary: 'Check health' })
  @ApiResponse({ status: 200, description: 'Healthy' })
  @ApiResponse({ status: '5XX', description: 'Unhealthy' })
  checkHealth(): string {
    return this.healthService.check();
  }
}
