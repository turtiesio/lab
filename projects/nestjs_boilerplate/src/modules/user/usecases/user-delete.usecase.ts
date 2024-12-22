import { Injectable, Inject } from '@nestjs/common';
import {
  UserDeleteDtoMapper,
  UserDeleteRequestDto,
  UserDeleteResponseDto,
} from './user-delete.dto';
import { IUserRepository } from '../infrastructure/repository/user.repo.interface';

@Injectable()
export class UserDeleteUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

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
