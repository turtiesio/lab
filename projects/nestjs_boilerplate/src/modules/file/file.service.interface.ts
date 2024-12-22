import {
  FileCreateRequestDto,
  FileResponseDto,
  FileDeleteRequestDto,
} from './file.dto';

export interface IFileService {
  create(dto: FileCreateRequestDto): Promise<FileResponseDto>;
  findById(id: string): Promise<FileResponseDto>;
  delete(dto: FileDeleteRequestDto): Promise<FileResponseDto>;
}
