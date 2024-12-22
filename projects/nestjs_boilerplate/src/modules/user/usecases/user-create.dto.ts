import { IsEmail, IsString } from 'class-validator';
import { IsULID } from '../../../utils/is-ulid';
import { UserEntity } from '../user.entity';

export class UserCreateRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class UserCreateResponseDto {
  @IsULID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class UserCreateDtoMapper {
  static toEntity(dto: UserCreateRequestDto): UserEntity {
    return UserEntity.create({ email: dto.email, name: dto.name });
  }

  static fromEntity(entity: UserEntity): UserCreateResponseDto {
    const response = new UserCreateResponseDto();
    response.id = entity.id;
    response.email = entity.email;
    response.name = entity.name;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    return response;
  }
}
