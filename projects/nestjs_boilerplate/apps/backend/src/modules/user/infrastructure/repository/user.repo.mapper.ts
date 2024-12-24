import { UserSchema } from '@back/modules/user/infrastructure/repository/user.repo.schema';
import { User } from '@back/modules/user/user.entity';
import { Mutable } from '@back/utils/mutable';
import { Injectable } from '@nestjs/common';

// return null
export abstract class UserRepositoryMapper {
  abstract toDomain(schema: UserSchema): User;
  abstract toDomain(schema: UserSchema | null): User | null;
  abstract toSchema(domain: User): UserSchema;
}

@Injectable()
export class UserRepositoryMapperImpl implements UserRepositoryMapper {
  toDomain(schema: UserSchema): User;
  toDomain(schema: UserSchema | null): User | null;
  toDomain(schema: UserSchema | null): User | null {
    if (!schema) {
      return null;
    }

    const user = new User() as Mutable<User>;
    user.id = schema.id;
    user.email = schema.email;
    user.name = schema.name;
    user.createdAt = schema.createdAt;
    user.updatedAt = schema.updatedAt;
    user.deletedAt = schema.deletedAt;
    return user;
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
