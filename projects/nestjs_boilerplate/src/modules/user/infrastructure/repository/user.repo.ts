import { Injectable } from '@nestjs/common';
import { IUserRepository } from './user.repo.interface';
import { UserEntity } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSchema } from './user.repo.schema';
import { Repository } from 'typeorm';
import { UserRepositoryMapper } from './user.repo.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userModel: Repository<UserSchema>,
    private readonly mapper: UserRepositoryMapper,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const schema = this.mapper.toSchema(user);
    const saved = await this.userModel.save(schema);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const schema = await this.userModel.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.mapper.toDomain(schema);
  }
}
