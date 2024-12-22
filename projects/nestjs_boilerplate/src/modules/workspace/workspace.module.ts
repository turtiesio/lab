import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceSchema } from './infrastructure/repository/workspace.schema';
import { WorkspaceRepository } from './infrastructure/repository/workspace.repo';
import { WorkspaceRepositoryMapper } from './infrastructure/repository/workspace.repo.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceSchema])],
  providers: [
    WorkspaceRepository,
    {
      provide: 'IWorkspaceRepository',
      useClass: WorkspaceRepository,
    },
    WorkspaceRepositoryMapper,
  ],
  exports: ['IWorkspaceRepository'],
})
export class WorkspaceModule {}
