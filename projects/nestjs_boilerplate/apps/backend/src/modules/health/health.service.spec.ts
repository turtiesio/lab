import { HealthService, HealthServiceImpl } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    service = new HealthServiceImpl();
  });

  it('should return "OK"', () => {
    expect(service.check()).toBe('OK');
  });
});
