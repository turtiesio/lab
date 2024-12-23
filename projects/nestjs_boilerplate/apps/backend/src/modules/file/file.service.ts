import { Injectable, Inject } from '@nestjs/common';
import { IFileService } from './file.service.interface';
import {
  FileCreateRequestDto,
  FileResponseDto,
  FileDeleteRequestDto,
  FileDtoMapper,
} from './file.dto';
import { IFileRepository } from './infrastructure/repository/file.repo.interface';

@Injectable()
export class FileService implements IFileService {
  constructor(
    @Inject('IFileRepository')
    private readonly fileRepository: IFileRepository,
  ) {}

  async create(dto: FileCreateRequestDto): Promise<FileResponseDto> {
    const file = FileDtoMapper.toEntity(dto);
    const savedFile = await this.fileRepository.save(file);
    return FileDtoMapper.fromEntity(savedFile);
  }

  async findById(id: string): Promise<FileResponseDto> {
    const file = await this.fileRepository.findById(id);
    if (!file) {
      throw new Error('File not found');
    }
    return FileDtoMapper.fromEntity(file);
  }

  async delete(dto: FileDeleteRequestDto): Promise<FileResponseDto> {
    const file = await this.fileRepository.findById(dto.id);
    if (!file) {
      throw new Error('File not found');
    }
    file.setDeleted();
    const deletedFile = await this.fileRepository.save(file);
    return FileDtoMapper.fromEntity(deletedFile);
  }
}
