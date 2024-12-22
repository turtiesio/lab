import { Injectable, Inject } from '@nestjs/common';
import {
  UserCreateDtoMapper,
  UserCreateRequestDto,
  UserCreateResponseDto,
} from './user-create.dto';
import { IUserRepository } from '../infrastructure/repository/user.repo.interface';

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return UserCreateDtoMapper.fromEntity(
      await this.userRepository.save(UserCreateDtoMapper.toEntity(dto)),
    );
  }
}
