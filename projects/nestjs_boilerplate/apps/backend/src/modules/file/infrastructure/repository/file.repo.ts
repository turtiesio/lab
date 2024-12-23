import { Injectable } from '@nestjs/common';
import { IFileRepository } from './file.repo.interface';
import { FileEntity } from '../../file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileSchema } from './file.repo.schema';
import { Repository } from 'typeorm';
import { FileRepositoryMapper } from './file.repo.mapper';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileSchema)
    private readonly fileModel: Repository<FileSchema>,
    private readonly mapper: FileRepositoryMapper,
  ) {}

  async save(file: FileEntity): Promise<FileEntity> {
    const schema = this.mapper.toSchema(file);
    const saved = await this.fileModel.save(schema);
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<FileEntity | null> {
    const schema = await this.fileModel.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return this.mapper.toDomain(schema);
  }
}
