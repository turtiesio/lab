import { IsEmail, MinLength, MaxLength } from 'class-validator';

import { USER_MODULE } from '@back/modules/user/user.constants';
import { BaseDomain } from '@back/core/base.domain';

export class User extends BaseDomain<User> {
  @IsEmail()
  readonly email: string;

  @MinLength(USER_MODULE.MIN_NAME_LENGTH)
  @MaxLength(USER_MODULE.MAX_NAME_LENGTH)
  readonly name: string;

  // Domain business logic

  public changeName(name: string): User {
    return this.update({ name });
  }

  public markAsDeleted(): User {
    return this.softDelete();
  }
}
