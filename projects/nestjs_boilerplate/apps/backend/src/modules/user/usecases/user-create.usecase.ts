import { Injectable, Inject } from '@nestjs/common';
import {
  UserCreateDtoMapper,
  UserCreateRequestDto,
  UserCreateResponseDto,
} from './user-create.dto';
import { UserRepositoryImpl } from '@back/modules/user/infrastructure/repository/user.repo';
import { UserEmailExistsException } from '../user.exceptions';

@Injectable()
export class UserCreateUseCase {
  constructor(@Inject() private readonly userRepository: UserRepositoryImpl) {}

  async execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    const existingUser = await this.userRepository.findByEmail({
      email: dto.email,
    });

    if (existingUser) {
      throw new UserEmailExistsException({ email: dto.email });
    }

    return UserCreateDtoMapper.fromEntity(
      await this.userRepository.save({
        user: UserCreateDtoMapper.toEntity(dto),
      }),
    );
  }
}
