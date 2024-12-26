import { ulid } from 'ulid';
import {
  IsEmail,
  MinLength,
  MaxLength,
  IsDate,
  validateSync,
} from 'class-validator';

import { IsULID } from '../../utils/is-ulid';
import { Mutable } from '../../utils/mutable';
import { USER_MODULE } from '@back/modules/user/user.constants';

interface UserModel {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  changeName(name: string): User;
  setDeleted(): User;
  restore(): User;
}

/**
 * Represents a user in the system.
 * Implements the UserModel interface.
 */
export class User implements UserModel {
  /**
   * The unique identifier of the user.
   * Uses ULID for generation.
   */
  @IsULID()
  readonly id: string;

  /**
   * The email address of the user.
   * Must be a valid email format.
   */
  @IsEmail()
  readonly email: string;

  /**
   * The name of the user.
   * Must be between MIN_NAME_LENGTH and MAX_NAME_LENGTH characters long.
   */
  @MinLength(USER_MODULE.MIN_NAME_LENGTH)
  @MaxLength(USER_MODULE.MAX_NAME_LENGTH)
  readonly name: string;

  /**
   * The date and time when the user was created.
   */
  @IsDate()
  readonly createdAt: Date;

  /**
   * The date and time when the user was last updated.
   */
  @IsDate()
  readonly updatedAt: Date;

  /**
   * The date and time when the user was soft-deleted.
   * Null if the user is not deleted.
   */
  @IsDate()
  readonly deletedAt: Date | null;

  // Domain business logic

  /**
   * Changes the name of the user.
   *
   * @param name The new name for the user.
   * @returns The updated User entity.
   */
  public changeName(name: string): User {
    const user = this as Mutable<User>;
    user.name = name;
    user.updatedAt = new Date();
    return user;
  }

  /**
   * Marks the user as deleted by setting the 'deletedAt' timestamp.
   * This is a soft delete, preserving the user's data in the system.
   *
   * @returns The updated User entity with the 'deletedAt' timestamp set.
   */
  public setDeleted(): User {
    const user = this as Mutable<User>;
    user.deletedAt = new Date();
    return user;
  }

  /**
   * Restores a soft-deleted user by setting the 'deletedAt' timestamp to null.
   *
   * @returns The updated User entity with the 'deletedAt' timestamp set to null.
   */
  public restore(): User {
    const user = this as Mutable<User>;
    user.deletedAt = null;
    user.updatedAt = new Date();
    return user;
  }

  /**
   * Creates a new user.
   *
   * @param data The data to create the user with.
   * @returns The newly created User entity.
   */
  static create(data: Pick<User, 'email' | 'name'>): User {
    const user = new User() as Mutable<User>;
    user.id = ulid();
    user.email = data.email;
    user.name = data.name;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.deletedAt = null;

    const errors = validateSync(user, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.toString()}`);
    }

    return user;
  }
}
