import { Injectable } from '@nestjs/common';
import { User } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './user.repo.schema';
import { Repository, FindOneOptions } from 'typeorm';
import { UserRepositoryMapperImpl } from './user.repo.mapper';

/**
 * Abstract class defining the contract for user repository operations.
 */
export abstract class UserRepository {
  /**
   * Saves a user entity.
   * @param user The user entity to save.
   * @returns A promise that resolves to the saved user entity.
   */
  abstract save({ user }: { user: User }): Promise<User>;

  /**
   * Finds a user by their ID.
   * @param id The ID of the user to find
   * @param includeDeleted Optional parameter to include soft-deleted users
   * @returns A promise that resolves to the found user entity or null if not found
   */
  abstract findById({
    id,
    includeDeleted,
  }: {
    id: string;
    includeDeleted?: boolean;
  }): Promise<User | null>;

  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find
   * @returns A promise that resolves to the found user entity or null if not found
   */
  abstract findByEmail({ email }: { email: string }): Promise<User | null>;
}

/**
 * Concrete implementation of the UserRepository using TypeORM.
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userModel: Repository<UserSchema>,
    private readonly mapper: UserRepositoryMapperImpl,
  ) {}

  /**
   * Saves a user entity to the database.
   * @param user The user entity to save.
   * @returns A promise that resolves to the saved user entity.
   */
  async save({ user }: { user: User }): Promise<User> {
    return this.mapper.toDomain(
      await this.userModel.save(this.mapper.toSchema(user)),
    );
  }

  /**
   * Finds a user by their ID.
   * Excludes soft-deleted users by default.
   * @param id The ID of the user to find.
   * @param includeDeleted Optional parameter to include soft-deleted users.
   * @returns A promise that resolves to the found user entity or null if not found.
   */
  async findById({
    id,
    includeDeleted = false,
  }: {
    id: string;
    includeDeleted?: boolean;
  }): Promise<User | null> {
    const queryOptions: FindOneOptions<UserSchema> = {
      where: { id },
    };

    if (includeDeleted) {
      queryOptions.withDeleted = true;
    }

    const userSchema = await this.userModel.findOne(queryOptions);

    if (!userSchema) {
      return null;
    }

    return this.mapper.toDomain(userSchema);
  }

  /**
   * Finds a user by their email address.
   * @param email The email address of the user to find.
   * @returns A promise that resolves to the found user entity or null if not found.
   */
  async findByEmail({ email }: { email: string }): Promise<User | null> {
    const userSchema = await this.userModel.findOne({ where: { email } });

    if (!userSchema) {
      return null;
    }

    return this.mapper.toDomain(userSchema);
  }
}
