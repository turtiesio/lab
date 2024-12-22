import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { DatabaseModule } from './modules/database/database.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import config from './modules/config/config.config';
import { TypeOrmConfigService } from './modules/database/typeorm-config.service';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { UserWorkspaceModule } from './modules/user-workspace/user-workspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource({
          dataSource: new DataSource(options),
        });
      },
    }),
    UserModule,
    FileModule,
    DatabaseModule,
    WorkspaceModule,
    UserWorkspaceModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
