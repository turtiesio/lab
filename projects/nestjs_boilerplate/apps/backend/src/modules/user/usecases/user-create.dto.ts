import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { User } from '../user.entity';
import { USER_MODULE } from '@back/modules/user/user.constants';

export class UserCreateRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @Length(USER_MODULE.MIN_NAME_LENGTH, USER_MODULE.MAX_NAME_LENGTH)
  name: string;
}

// no validation is required for response
export class UserCreateResponseDto {
  @ApiProperty({ description: 'The ID of the newly created user' })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;
}

export class UserCreateDtoMapper {
  static toEntity(dto: UserCreateRequestDto): User {
    return User.create(dto);
  }

  static fromEntity(entity: User): UserCreateResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
    };
  }
}
