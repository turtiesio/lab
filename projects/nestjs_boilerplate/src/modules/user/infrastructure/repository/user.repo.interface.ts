import { UserEntity } from '../../user.entity';

export interface IUserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
}
