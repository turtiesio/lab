import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsULID } from '../../utils/is-ulid';
import { ulid } from 'ulid';
import { Mutable } from '../../utils/mutable';

interface UserWorkspace {
  readonly id: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly role?: string; // Optional: You can define roles like 'admin', 'editor', 'viewer'
  readonly createdAt: Date;
  readonly updatedAt: Date;

  setRole(role: string): UserWorkspace;
}

export class UserWorkspaceEntity implements UserWorkspace {
  @IsULID()
  readonly id: string;

  @IsULID()
  readonly userId: string;

  @IsULID()
  readonly workspaceId: string;

  @IsOptional()
  @IsString()
  readonly role?: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  public setRole(role: string): UserWorkspaceEntity {
    const userWorkspace = this as Mutable<UserWorkspaceEntity>;
    userWorkspace.role = role;
    userWorkspace.updatedAt = new Date();
    return userWorkspace;
  }

  static create(
    data: Pick<UserWorkspaceEntity, 'userId' | 'workspaceId' | 'role'>,
  ): UserWorkspaceEntity {
    const userWorkspace =
      new UserWorkspaceEntity() as Mutable<UserWorkspaceEntity>;
    userWorkspace.id = ulid();
    userWorkspace.userId = data.userId;
    userWorkspace.workspaceId = data.workspaceId;
    userWorkspace.role = data.role;
    userWorkspace.createdAt = new Date();
    userWorkspace.updatedAt = new Date();
    return userWorkspace;
  }
}
