import { Injectable, Inject } from '@nestjs/common';
import {
  UserDeleteDtoMapper,
  UserDeleteRequestDto,
  UserDeleteResponseDto,
} from './user-delete.dto';
import { UserRepository } from '../infrastructure/repository/user.repo';
import { UserNotFoundException } from '../user.exceptions';

@Injectable()
export class UserDeleteUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: UserDeleteRequestDto): Promise<UserDeleteResponseDto> {
    const user = await this.userRepository.findById({ id: dto.id });

    if (!user) {
      throw new UserNotFoundException({ userId: dto.id });
    }

    return UserDeleteDtoMapper.fromEntity(
      await this.userRepository.save({ user: user.markAsDeleted() }),
    );
  }
}
