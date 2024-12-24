import { Injectable, Inject } from '@nestjs/common';
import {
  UserDeleteDtoMapper,
  UserDeleteRequestDto,
  UserDeleteResponseDto,
} from './user-delete.dto';
import { UserRepositoryImpl } from '../infrastructure/repository/user.repo';

@Injectable()
export class UserDeleteUseCase {
  constructor(@Inject() private readonly userRepository: UserRepositoryImpl) {}

  async execute(dto: UserDeleteRequestDto): Promise<UserDeleteResponseDto> {
    const user = await this.userRepository.findById(dto.id);

    if (!user) {
      throw new Error('User not found');
    }

    return UserDeleteDtoMapper.fromEntity(
      await this.userRepository.save(user.setDeleted()),
    );
  }
}
