import { IsString, IsOptional } from 'class-validator';
import { IsULID } from '../../utils/is-ulid';
import { FileEntity } from './file.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FileCreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  path: string;
}

export class FileResponseDto {
  @ApiProperty()
  @IsULID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty()
  @IsString()
  createdAt: string;

  @ApiProperty()
  @IsString()
  updatedAt: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deletedAt?: string;
}

export class FileDeleteRequestDto {
  @ApiProperty()
  @IsULID()
  id: string;
}

export class FileDtoMapper {
  static toEntity(dto: FileCreateRequestDto): FileEntity {
    return FileEntity.create({ name: dto.name, path: dto.path });
  }

  static fromEntity(entity: FileEntity): FileResponseDto {
    const response = new FileResponseDto();
    response.id = entity.id;
    response.name = entity.name;
    response.path = entity.path;
    response.createdAt = entity.createdAt.toISOString();
    response.updatedAt = entity.updatedAt.toISOString();
    response.deletedAt = entity.deletedAt?.toISOString();
    return response;
  }
}
