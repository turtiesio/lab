import { IsString, MinLength, MaxLength, IsDate } from 'class-validator';
import { IsULID } from '../../utils/is-ulid';
import { ulid } from 'ulid';
import { Mutable } from '../../utils/mutable';
import { UserWorkspaceEntity } from '../user-workspace/user-workspace.entity';

interface Workspace {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly users: UserWorkspaceEntity[];

  changeName(name: string): Workspace;
  setDeleted(): Workspace;
}

export class WorkspaceEntity implements Workspace {
  @IsULID()
  readonly id: string;

  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  readonly deletedAt: Date | null;

  readonly users: UserWorkspaceEntity[];

  // Domain business logic

  public changeName(name: string): WorkspaceEntity {
    const workspace = this as Mutable<WorkspaceEntity>;
    workspace.name = name;
    workspace.updatedAt = new Date();
    return workspace;
  }

  public setDeleted(): WorkspaceEntity {
    const workspace = this as Mutable<WorkspaceEntity>;
    workspace.deletedAt = new Date();
    workspace.updatedAt = new Date();
    return workspace;
  }

  //

  static create(data: Pick<WorkspaceEntity, 'name'>): WorkspaceEntity {
    const workspace = new WorkspaceEntity() as Mutable<WorkspaceEntity>;
    workspace.id = ulid();
    workspace.name = data.name;
    workspace.createdAt = new Date();
    workspace.updatedAt = new Date();
    workspace.deletedAt = null;
    return workspace;
  }
}
