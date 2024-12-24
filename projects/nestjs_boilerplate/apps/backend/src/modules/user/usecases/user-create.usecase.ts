import { Injectable, Inject } from '@nestjs/common';
import {
  UserCreateDtoMapper,
  UserCreateRequestDto,
  UserCreateResponseDto,
} from './user-create.dto';
import { UserRepositoryImpl } from '@back/modules/user/infrastructure/repository/user.repo';

@Injectable()
export class UserCreateUseCase {
  constructor(@Inject() private readonly userRepository: UserRepositoryImpl) {}

  async execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return UserCreateDtoMapper.fromEntity(
      await this.userRepository.save(UserCreateDtoMapper.toEntity(dto)),
    );
  }
}
