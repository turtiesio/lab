import { Injectable } from '@nestjs/common';
import { User } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './user.repo.schema';
import { Repository } from 'typeorm';
import { UserRepositoryMapper } from './user.repo.mapper';

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
}

@Injectable()
export class UserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userModel: Repository<UserSchema>,
    private readonly mapper: UserRepositoryMapper,
  ) {}

  async save(user: User): Promise<User> {
    return this.mapper.toDomain(
      await this.userModel.save(this.mapper.toSchema(user)),
    );
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.userModel.findOne({ where: { id } });

    if (!schema) {
      return null;
    }

    return this.mapper.toDomain(schema);
  }
}
