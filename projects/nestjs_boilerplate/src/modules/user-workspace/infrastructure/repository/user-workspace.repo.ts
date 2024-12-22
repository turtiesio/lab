import { Injectable } from '@nestjs/common';
import { IUserWorkspaceRepository } from './user-workspace.repo.interface';
import { UserWorkspaceEntity } from '../../user-workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkspaceSchema } from './user-workspace.schema';
import { Repository } from 'typeorm';
import { UserWorkspaceRepositoryMapper } from './user-workspace.repo.mapper';

@Injectable()
export class UserWorkspaceRepository implements IUserWorkspaceRepository {
  constructor(
    @InjectRepository(UserWorkspaceSchema)
    private readonly userWorkspaceModel: Repository<UserWorkspaceSchema>,
    private readonly mapper: UserWorkspaceRepositoryMapper,
  ) {}

  async save(userWorkspace: UserWorkspaceEntity): Promise<UserWorkspaceEntity> {
    const schema = this.mapper.toSchema(userWorkspace);
    const saved = await this.userWorkspaceModel.save(schema);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<UserWorkspaceEntity | null> {
    const schema = await this.userWorkspaceModel.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.mapper.toDomain(schema);
  }

  async findByUserAndWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<UserWorkspaceEntity | null> {
    const schema = await this.userWorkspaceModel.findOne({
      where: { userId, workspaceId },
    });
    if (!schema) {
      return null;
    }
    return this.mapper.toDomain(schema);
  }
}
