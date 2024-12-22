import { FileEntity } from '../../file.entity';

export interface IFileRepository {
  save(file: FileEntity): Promise<FileEntity>;
  findById(id: string): Promise<FileEntity | null>;
}
