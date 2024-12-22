import { UserEntity } from '../user.entity';
import { IsULID } from '../../../utils/is-ulid';
import { IsEmail, IsISO8601, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from 'src/utils/is-nullable';

export class DeleteUserRequestDto {
  @ApiProperty()
  @IsULID()
  id: string;
}

export class DeleteUserResponseDto {
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

  @ApiProperty({
    nullable: true,
    type: 'string',
  })
  @IsNullable()
  @IsISO8601()
  deletedAt: string | null;

  static fromEntity(entity: UserEntity): DeleteUserResponseDto {
    const response = new DeleteUserResponseDto();
    response.id = entity.id;
    response.email = entity.email;
    response.name = entity.name;
    response.createdAt = entity.createdAt.toISOString();
    response.deletedAt = entity.deletedAt
      ? entity.deletedAt.toISOString()
      : null;
    return response;
  }
}
