import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { IFileRepository } from './infrastructure/repository/file.repo.interface';
import { FileRepository } from './infrastructure/repository/file.repo';
import { FileRepositoryMapper } from './infrastructure/repository/file.repo.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileSchema } from './infrastructure/repository/file.repo.schema';

@Module({
  imports: [TypeOrmModule.forFeature([FileSchema])],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'IFileRepository',
      useClass: FileRepository,
    },
    FileRepositoryMapper,
  ],
})
export class FileModule {}
