import { IsString, MinLength, MaxLength, IsDate } from 'class-validator';
import { IsULID } from '../../utils/is-ulid';
import { ulid } from 'ulid';
import { Mutable } from '../../utils/mutable';

interface File {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  changeName(name: string): File;
  setDeleted(): File;
}

export class FileEntity implements File {
  @IsULID()
  readonly id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly name: string;

  @IsString()
  readonly path: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  readonly deletedAt: Date | null;

  // Domain business logic

  public changeName(name: string): FileEntity {
    const file = this as Mutable<FileEntity>;
    file.name = name;
    file.updatedAt = new Date();
    return file;
  }

  public setDeleted(): FileEntity {
    const file = this as Mutable<FileEntity>;
    const now = new Date();
    file.deletedAt = now;
    file.updatedAt = now;
    return file;
  }

  //

  static create(data: Pick<FileEntity, 'name' | 'path'>): FileEntity {
    const file = new FileEntity() as Mutable<FileEntity>;
    file.id = ulid();
    file.name = data.name;
    file.path = data.path;
    file.createdAt = new Date();
    file.updatedAt = new Date();
    file.deletedAt = null;
    return file;
  }
}
