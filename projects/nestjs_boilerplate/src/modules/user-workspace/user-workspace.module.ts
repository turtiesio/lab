import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkspaceSchema } from './infrastructure/repository/user-workspace.schema';
import { UserWorkspaceRepository } from './infrastructure/repository/user-workspace.repo';
import { UserWorkspaceRepositoryMapper } from './infrastructure/repository/user-workspace.repo.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([UserWorkspaceSchema])],
  providers: [
    UserWorkspaceRepository,
    {
      provide: 'IUserWorkspaceRepository',
      useClass: UserWorkspaceRepository,
    },
    UserWorkspaceRepositoryMapper,
  ],
  exports: ['IUserWorkspaceRepository'],
})
export class UserWorkspaceModule {}
