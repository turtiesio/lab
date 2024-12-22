import { Injectable } from '@nestjs/common';
import { FileEntity } from '../../file.entity';
import { FileSchema } from './file.repo.schema';
import { Mutable } from '../../../../utils/mutable';

@Injectable()
export class FileRepositoryMapper {
  toDomain(schema: FileSchema): FileEntity {
    const file = new FileEntity() as Mutable<FileEntity>;
    file.id = schema.id;
    file.name = schema.name;
    file.path = schema.path;
    file.createdAt = schema.createdAt;
    file.updatedAt = schema.updatedAt;
    file.deletedAt = schema.deletedAt;
    return file;
  }

  toSchema(domain: FileEntity): FileSchema {
    const schema = new FileSchema();
    schema.id = domain.id;
    schema.name = domain.name;
    schema.path = domain.path;
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    schema.deletedAt = domain.deletedAt;
    return schema;
  }
}
