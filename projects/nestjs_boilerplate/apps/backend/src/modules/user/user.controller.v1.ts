import { Controller, Post, Body } from '@nestjs/common';
import {
  UserCreateResponseDto,
  UserCreateRequestDto,
} from './usecases/user-create.dto';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserControllerV1 {
  constructor(private readonly userCreateUseCase: UserCreateUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'The user to create',
    type: UserCreateRequestDto,
  })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: UserCreateResponseDto,
  })
  async createUser(
    @Body() dto: UserCreateRequestDto,
  ): Promise<UserCreateResponseDto> {
    return this.userCreateUseCase.execute(dto);
  }
}
