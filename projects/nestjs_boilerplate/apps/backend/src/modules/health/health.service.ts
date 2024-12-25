import { Injectable } from '@nestjs/common';

export abstract class HealthService {
  abstract check(): string;
}

@Injectable()
export class HealthServiceImpl implements HealthService {
  check(): string {
    return 'OK';
  }
}
