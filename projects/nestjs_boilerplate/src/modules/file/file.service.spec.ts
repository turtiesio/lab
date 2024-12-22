import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { IFileRepository } from './infrastructure/repository/file.repo.interface';
import { FileEntity } from './file.entity';
import { FileDtoMapper } from './file.dto';

describe('FileService', () => {
  let service: FileService;
  let fileRepository: jest.Mocked<IFileRepository>;

  beforeEach(async () => {
    const fileRepositoryMock: Partial<IFileRepository> = {
      save: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: 'IFileRepository',
          useValue: fileRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    fileRepository =
      module.get<jest.Mocked<IFileRepository>>('IFileRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a file', async () => {
      const dto = { name: 'test.txt', path: '/path/to/test.txt' };
      const fileEntity = FileEntity.create(dto);
      fileRepository.save.mockResolvedValue(fileEntity);

      const result = await service.create(dto);

      expect(fileRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
      expect(result).toEqual(FileDtoMapper.fromEntity(fileEntity));
    });
  });

  describe('findById', () => {
    it('should find a file by id', async () => {
      const fileEntity = FileEntity.create({
        name: 'test.txt',
        path: '/path/to/test.txt',
      });
      fileRepository.findById.mockResolvedValue(fileEntity);

      const result = await service.findById('some-id');

      expect(fileRepository.findById).toHaveBeenCalledWith('some-id');
      expect(result).toEqual(FileDtoMapper.fromEntity(fileEntity));
    });

    it('should throw an error if file is not found', async () => {
      fileRepository.findById.mockResolvedValue(null);

      await expect(service.findById('some-id')).rejects.toThrow(
        'File not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a file', async () => {
      const fileEntity = FileEntity.create({
        name: 'test.txt',
        path: '/path/to/test.txt',
      });
      fileRepository.findById.mockResolvedValue(fileEntity);
      fileRepository.save.mockResolvedValue(fileEntity.setDeleted());

      const result = await service.delete({ id: 'some-id' });

      expect(fileRepository.findById).toHaveBeenCalledWith('some-id');
      expect(fileRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ deletedAt: expect.any(Date) }),
      );
      expect(result).toEqual(FileDtoMapper.fromEntity(fileEntity.setDeleted()));
    });

    it('should throw an error if file is not found', async () => {
      fileRepository.findById.mockResolvedValue(null);

      await expect(service.delete({ id: 'some-id' })).rejects.toThrow(
        'File not found',
      );
    });
  });
});
