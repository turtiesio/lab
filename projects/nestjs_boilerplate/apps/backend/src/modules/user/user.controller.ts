import { Controller, Post, Body } from '@nestjs/common';
import {
  UserCreateResponseDto,
  UserCreateRequestDto,
} from './usecases/user-create.dto';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userCreateUseCase: UserCreateUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createUser(
    @Body() dto: UserCreateRequestDto,
  ): Promise<UserCreateResponseDto> {
    return this.userCreateUseCase.execute(dto);
  }
}
