import { Injectable, Inject } from '@nestjs/common';
import { UserCreateRequestDto, UserCreateResponseDto } from './user-create.dto';
import { IUserRepository } from '../infrastructure/repository/user.repo.interface';

@Injectable()
export class UserCreateUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto> {
    return UserCreateResponseDto.fromEntity(
      await this.userRepository.save(dto.toEntity()),
    );
  }
}
