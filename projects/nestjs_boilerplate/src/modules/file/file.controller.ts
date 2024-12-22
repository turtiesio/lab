import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  FileCreateRequestDto,
  FileResponseDto,
  FileDeleteRequestDto,
} from './file.dto';
import { IFileService } from './file.service.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(
    @Inject('IFileService') private readonly fileService: IFileService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new file' })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully created.',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createFile(
    @Body() dto: FileCreateRequestDto,
  ): Promise<FileResponseDto> {
    return this.fileService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by id' })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully retrieved.',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async getFile(@Param('id') id: string): Promise<FileResponseDto> {
    return this.fileService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file by id' })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully deleted.',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async deleteFile(@Param('id') id: string): Promise<FileResponseDto> {
    const dto: FileDeleteRequestDto = { id };
    return this.fileService.delete(dto);
  }
}
