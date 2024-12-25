import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MyLogger } from './logger/logger.service';
import { AppConfig } from '@back/app.config';
import { HttpExceptionFilter } from '@back/utils/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = await app.resolve(MyLogger);

  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties that are not in the DTO
      transform: true, // Automatically transform payloads to DTO objects
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );
  const configService = app.get(ConfigService);
  const configApp = configService.get<AppConfig>('app');

  // Swagger Setup (Conditional)
  if (configApp?.nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('User Management API')
      .setDescription('API documentation for the User Management service')
      .setVersion('1.0')
      .addTag('users')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useLogger(await app.resolve(MyLogger));

  await app.listen(configApp?.port ?? 3000);
}
bootstrap();
