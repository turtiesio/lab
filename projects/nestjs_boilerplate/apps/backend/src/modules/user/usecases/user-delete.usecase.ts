import { Injectable, Inject } from '@nestjs/common';
import {
  UserDeleteDtoMapper,
  UserDeleteRequestDto,
  UserDeleteResponseDto,
} from './user-delete.dto';
import { UserRepositoryImpl } from '../infrastructure/repository/user.repo';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';

/**
 * Use case for deleting a user.
 */
@Injectable()
export class UserDeleteUseCase {
  constructor(@Inject() private readonly userRepository: UserRepositoryImpl) {}

  /**
   * Executes the use case to delete a user.
   * @param dto The data transfer object containing the user's ID.
   * @returns A promise that resolves to the deleted user's response DTO.
   * @throws {UserNotFoundException} If a user with the given ID is not found.
   */
  async execute(dto: UserDeleteRequestDto): Promise<UserDeleteResponseDto> {
    const user = await this.userRepository.findById(dto.id);

    if (!user) {
      throw new UserNotFoundException(dto.id);
    }

    return UserDeleteDtoMapper.fromEntity(
      await this.userRepository.save(user.setDeleted()),
    );
  }
}
