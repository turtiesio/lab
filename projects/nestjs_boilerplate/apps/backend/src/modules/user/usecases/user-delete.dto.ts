import { User } from '../user.entity';
import { IsULID } from '../../../utils/is-ulid';
import { IsNullable } from '../../../utils/is-nullable';
import { IsEmail, IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDeleteRequestDto {
  @ApiProperty()
  @IsULID()
  id: string;
}

export class UserDeleteResponseDto {
  @ApiProperty()
  @IsULID()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsISO8601()
  createdAt: string;

  @ApiProperty()
  @IsISO8601()
  updatedAt: string;

  @ApiProperty({
    nullable: true,
    type: 'string',
  })
  @IsNullable()
  @IsISO8601()
  deletedAt: string | null;
}

export class UserDeleteDtoMapper {
  static fromEntity(entity: User): UserDeleteResponseDto {
    const response = new UserDeleteResponseDto();
    response.id = entity.id;
    response.email = entity.email;
    response.name = entity.name;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    response.deletedAt = entity.deletedAt
      ? entity.deletedAt.toISOString()
      : null;
    return response;
  }
}
