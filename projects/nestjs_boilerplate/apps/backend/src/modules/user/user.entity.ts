import { ulid } from 'ulid';
import { IsEmail, MinLength, MaxLength, IsDate } from 'class-validator';

import { IsULID } from '../../utils/is-ulid';
import { Mutable } from '../../utils/mutable';
import { UserWorkspaceEntity } from '@back/modules/user-workspace/user-workspace.entity';
import { USER_MODULE } from '@back/modules/user/user.constants';

interface UserModel {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly workspaces: UserWorkspaceEntity[];

  changeName(name: string): User;
  setDeleted(): User;
}

export class User implements UserModel {
  @IsULID()
  readonly id: string;

  @IsEmail()
  readonly email: string;

  @MinLength(USER_MODULE.MIN_NAME_LENGTH)
  @MaxLength(USER_MODULE.MAX_NAME_LENGTH)
  readonly name: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  readonly deletedAt: Date | null;

  readonly workspaces: UserWorkspaceEntity[];

  // Domain business logic

  public changeName(name: string): User {
    const user = this as Mutable<User>;
    user.name = name;
    user.updatedAt = new Date();
    return user;
  }

  public setDeleted(): User {
    const user = this as Mutable<User>;
    user.deletedAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  static create(data: Pick<User, 'email' | 'name'>): User {
    const user = new User() as Mutable<User>;
    user.id = ulid();
    user.email = data.email;
    user.name = data.name;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.deletedAt = null;
    return user;
  }
}
