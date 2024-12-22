import { IsEmail, MinLength, MaxLength, IsDate } from 'class-validator';
import { IsULID } from '../../utils/is-ulid';
import { ulid } from 'ulid';
import { Mutable } from '../../utils/mutable';

interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  changeName(name: string): User;
  setDeleted(): User;
}

export class UserEntity implements User {
  @IsULID()
  readonly id: string;

  @IsEmail()
  readonly email: string;

  @MinLength(2)
  @MaxLength(50)
  readonly name: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  readonly deletedAt: Date | null;

  // Domain business logic

  public changeName(name: string): UserEntity {
    const user = this as Mutable<UserEntity>;
    user.name = name;
    user.updatedAt = new Date();
    return user;
  }

  public setDeleted(): UserEntity {
    const user = this as Mutable<UserEntity>;
    user.deletedAt = new Date();
    user.updatedAt = new Date();
    return user;
  }

  //

  static create(data: Pick<UserEntity, 'email' | 'name'>): UserEntity {
    const user = new UserEntity() as Mutable<UserEntity>;
    user.id = ulid();
    user.email = data.email;
    user.name = data.name;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.deletedAt = null;
    return user;
  }
}
