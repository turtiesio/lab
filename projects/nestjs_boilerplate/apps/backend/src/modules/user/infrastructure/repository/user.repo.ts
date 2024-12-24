import { Injectable } from '@nestjs/common';
import { User } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './user.repo.schema';
import { Repository } from 'typeorm';
import { UserRepositoryMapperImpl } from './user.repo.mapper';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
}

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userModel: Repository<UserSchema>,
    private readonly mapper: UserRepositoryMapperImpl,
  ) {}

  async save(user: User): Promise<User> {
    return this.mapper.toDomain(
      await this.userModel.save(this.mapper.toSchema(user)),
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.mapper.toDomain(
      await this.userModel.findOne({ where: { id } }),
    );
  }
}
