import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user.entity';
import { UserSchema } from './user.repo.schema';
import { Mutable } from '../../../../utils/mutable';

@Injectable()
export class UserRepositoryMapper {
  toDomain(schema: UserSchema): UserEntity {
    const user = new UserEntity() as Mutable<UserEntity>;
    user.id = schema.id;
    user.email = schema.email;
    user.name = schema.name;
    user.createdAt = schema.createdAt;
    user.updatedAt = schema.updatedAt;
    user.deletedAt = schema.deletedAt;
    return user;
  }

  toSchema(domain: UserEntity): UserSchema {
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
