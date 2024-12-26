import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from './logger/logger.service';
import { AppConfig } from '@back/app.config';
import { HttpExceptionFilter } from '@back/utils/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const loggerFactory = async (context: string = '') => {
    const logger = await app.resolve(MyLogger);
    if (context) {
      logger.setContext(context);
    }
    return logger;
  };

  app.useLogger(await loggerFactory('NestJS'));

  app.useGlobalFilters(
    new HttpExceptionFilter(await loggerFactory(HttpExceptionFilter.name)),
  );

  // Global Prefix: /api
  app.setGlobalPrefix('api');

  // API Versioning - URI Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties that are not in the DTO
      transform: true, // Automatically transform payloads to DTO objects
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      forbidUnknownValues: true, // Throw an error if unknown values are present
    }),
  );
  const configService = app.get(ConfigService);
  const configApp = configService.get<AppConfig>('app', { infer: true });

  // Swagger Setup (Conditional)
  if (configApp.nodeEnv === 'development') {
    SwaggerModule.setup(
      '/api/docs',
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle('User Management API')
          .setDescription('API documentation for the User Management service')
          .setVersion('1.0')
          .build(),
      ),
    );
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Be very careful with 'unsafe-inline'
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Disable COEP if not needed
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: [configApp.frontendDomain],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // If you need to send cookies or auth headers
  });

  await app.listen(configApp.port);
}
bootstrap();
