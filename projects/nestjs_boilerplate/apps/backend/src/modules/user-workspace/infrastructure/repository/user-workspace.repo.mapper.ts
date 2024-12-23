import { Injectable } from '@nestjs/common';
import { UserWorkspaceEntity } from '../../user-workspace.entity';
import { UserWorkspaceSchema } from './user-workspace.schema';
import { Mutable } from '../../../../utils/mutable';

@Injectable()
export class UserWorkspaceRepositoryMapper {
  toDomain(schema: UserWorkspaceSchema): UserWorkspaceEntity {
    const userWorkspace =
      new UserWorkspaceEntity() as Mutable<UserWorkspaceEntity>;
    userWorkspace.id = schema.id;
    userWorkspace.userId = schema.userId;
    userWorkspace.workspaceId = schema.workspaceId;
    userWorkspace.role = schema.role;
    userWorkspace.createdAt = schema.createdAt;
    userWorkspace.updatedAt = schema.updatedAt;
    return userWorkspace;
  }

  toSchema(domain: UserWorkspaceEntity): UserWorkspaceSchema {
    const schema = new UserWorkspaceSchema();
    schema.id = domain.id;
    schema.userId = domain.userId;
    schema.workspaceId = domain.workspaceId;
    schema.role = domain.role;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}
