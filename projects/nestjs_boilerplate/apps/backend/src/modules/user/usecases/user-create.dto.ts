import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { IsULID } from '@back/utils/is-ulid';
import { User } from '../user.entity';

export class UserCreateRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  name: string;
}

export class UserCreateResponseDto {
  @ApiProperty({ description: 'The ID of the newly created user' })
  @IsULID()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The creation timestamp' })
  @IsString()
  createdAt: string;

  @ApiProperty({ description: 'The last update timestamp' })
  @IsString()
  updatedAt: string;
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
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
