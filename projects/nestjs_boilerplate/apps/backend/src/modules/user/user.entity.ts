import { IsEmail, MinLength, MaxLength } from 'class-validator';

import { USER_MODULE } from '@back/modules/user/user.constants';
import { BaseDomain } from '@back/core/base.domain';

type ChangeNameOptions = { name: string; now?: Date };
type MarkAsDeletedOptions = { now?: Date };

export class User extends BaseDomain<User> {
  @IsEmail()
  readonly email: string;

  @MinLength(USER_MODULE.MIN_NAME_LENGTH)
  @MaxLength(USER_MODULE.MAX_NAME_LENGTH)
  readonly name: string;

  // Domain business logic

  public changeName({ name, now = new Date() }: ChangeNameOptions): User {
    return this.clone({ name, updatedAt: now });
  }

  public markAsDeleted({ now = new Date() }: MarkAsDeletedOptions): User {
    return this.clone({ updatedAt: now, deletedAt: now });
  }
}
