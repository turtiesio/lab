import { IsEmail, IsString } from 'class-validator';
import { UserEntity } from '../user.entity';
import { IsULID } from '../../../utils/is-ulid';

export class UserCreateRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  toEntity(): UserEntity {
    return UserEntity.create({ email: this.email, name: this.name });
  }
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

  static fromEntity(entity: UserEntity): UserCreateResponseDto {
    const response = new UserCreateResponseDto();
    response.id = entity.id;
    response.email = entity.email;
    response.name = entity.name;
    response.createdAt = entity.createdAt.toISOString();
    return response;
  }
}
