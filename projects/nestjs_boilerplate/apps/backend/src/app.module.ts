import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { UserWorkspaceModule } from './modules/user-workspace/user-workspace.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      envFilePath: ['.env.local'],
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
