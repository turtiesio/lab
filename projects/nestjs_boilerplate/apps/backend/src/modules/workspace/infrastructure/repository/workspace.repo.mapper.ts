import { Injectable } from '@nestjs/common';
import { WorkspaceEntity } from '../../workspace.entity';
import { WorkspaceSchema } from './workspace.schema';
import { Mutable } from '../../../../utils/mutable';

@Injectable()
export class WorkspaceRepositoryMapper {
  toDomain(schema: WorkspaceSchema): WorkspaceEntity {
    const workspace = new WorkspaceEntity() as Mutable<WorkspaceEntity>;
    workspace.id = schema.id;
    workspace.name = schema.name;
    workspace.createdAt = schema.createdAt;
    workspace.updatedAt = schema.updatedAt;
    workspace.deletedAt = schema.deletedAt;
    return workspace;
  }

  toSchema(domain: WorkspaceEntity): WorkspaceSchema {
    const schema = new WorkspaceSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt;
    return schema;
  }
}
