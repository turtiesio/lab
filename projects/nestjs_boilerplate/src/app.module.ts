import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import configuration from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationOptions: {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      envFilePath: '.env.local',
    }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
