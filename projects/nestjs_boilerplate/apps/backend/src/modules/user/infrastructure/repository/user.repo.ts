import { Injectable, Provider } from '@nestjs/common';
import { User } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './user.repo.schema';
import { Repository } from 'typeorm';

type SaveOptions = { user: User };
type FindByIdOptions = { id: string; includeDeleted?: boolean };
type FindByEmailOptions = { email: string };

export abstract class UserRepository {
  /** Saves a user entity to the database. */
  abstract save(options: SaveOptions): Promise<User>;

  /** Finds a user by their ID. */
  abstract findById(options: FindByIdOptions): Promise<User | null>;

  /** Finds a user by their email address. */
  abstract findByEmail(options: FindByEmailOptions): Promise<User | null>;

  /** Transforms a schema to a domain entity */
  abstract toDomain(schema: UserSchema): User;
  abstract toDomain(schema: UserSchema | null): User | null;

  /** Transforms a domain entity to a schema */
  abstract toSchema(domain: User): UserSchema;
}

@Injectable()
class ConcreteUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userModel: Repository<UserSchema>,
  ) {}

  async save({ user }: SaveOptions): Promise<User> {
    return this.toDomain(await this.userModel.save(this.toSchema(user)));
  }

  async findById(options: FindByIdOptions): Promise<User | null> {
    return this.toDomain(
      await this.userModel.findOne({
        where: { id: options.id },
        withDeleted: options.includeDeleted,
      }),
    );
  }

  async findByEmail({ email }: FindByEmailOptions): Promise<User | null> {
    return this.toDomain(await this.userModel.findOne({ where: { email } }));
  }

  toDomain(schema: UserSchema): User;
  toDomain(schema: UserSchema | null): User | null;
  toDomain(schema: UserSchema | null): User | null {
    return schema ? User.restore({ ...schema }) : null;
  }

  toSchema(domain: User): UserSchema {
    const schema = new UserSchema();
    schema.id = domain.id;
    schema.email = domain.email;
    schema.name = domain.name;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt;
    return schema;
  }
}

export const UserRepositoryProvider: Provider = {
  provide: UserRepository,
  useClass: ConcreteUserRepository,
};
