import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { UserWorkspaceModule } from './modules/user-workspace/user-workspace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@back/modules/database/database.config';
import appConfig from '@back/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    FileModule,
    UserModule,
    WorkspaceModule,
    UserWorkspaceModule,
  ],
})
export class AppModule {}
