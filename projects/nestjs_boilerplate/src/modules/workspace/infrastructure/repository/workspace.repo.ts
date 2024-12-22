import { Injectable } from '@nestjs/common';
import { IWorkspaceRepository } from './workspace.repo.interface';
import { WorkspaceEntity } from '../../workspace.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceSchema } from './workspace.schema';
import { Repository } from 'typeorm';
import { WorkspaceRepositoryMapper } from './workspace.repo.mapper';

@Injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  constructor(
    @InjectRepository(WorkspaceSchema)
    private readonly workspaceModel: Repository<WorkspaceSchema>,
    private readonly mapper: WorkspaceRepositoryMapper,
  ) {}

  async save(workspace: WorkspaceEntity): Promise<WorkspaceEntity> {
    const schema = this.mapper.toSchema(workspace);
    const saved = await this.workspaceModel.save(schema);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<WorkspaceEntity | null> {
    const schema = await this.workspaceModel.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.mapper.toDomain(schema);
  }
}
