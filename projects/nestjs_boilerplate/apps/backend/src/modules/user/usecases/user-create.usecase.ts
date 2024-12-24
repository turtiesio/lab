import { Injectable, Inject } from '@nestjs/common';
import {
  UserCreateDtoMapper,
  UserCreateRequestDto,
  UserCreateResponseDto,
} from './user-create.dto';
import { UserRepositoryImpl } from '@back/modules/user/infrastructure/repository/user.repo';
import { UserEmailExistsException } from '../exceptions/user-email-exists.exception';

/**
 * Use case for creating a new user.
 */
@Injectable()
export class UserCreateUseCase {
  constructor(@Inject() private readonly userRepository: UserRepositoryImpl) {}

  /**
   * Executes the use case to create a new user.
   * @param dto The data transfer object containing the user's information.
   * @returns A promise that resolves to the created user's response DTO.
   * @throws {UserEmailExistsException} If a user with the given email already exists.
   */
  async execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserEmailExistsException(dto.email);
    }
    return UserCreateDtoMapper.fromEntity(
      await this.userRepository.save(UserCreateDtoMapper.toEntity(dto)),
    );
  }
}
