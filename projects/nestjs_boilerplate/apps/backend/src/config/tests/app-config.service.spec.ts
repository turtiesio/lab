import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from '../app-config.service';
import { ConfigService } from '@nestjs/config';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'app.port') {
                return 3000;
              }
              if (key === 'app.environment') {
                return 'test';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct port', () => {
    expect(service.port).toBe(3000);
  });

  it('should return the correct environment', () => {
    expect(service.environment).toBe('test');
  });
});
