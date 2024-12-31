import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import {
  UserCreateResponseDto,
  UserCreateRequestDto,
} from './usecases/user-create.dto';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { UserDeleteUseCase } from './usecases/user-delete.usecase';
import { UserDeleteResponseDto } from './usecases/user-delete.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserControllerV1 {
  constructor(
    private readonly userCreateUseCase: UserCreateUseCase,
    private readonly userDeleteUseCase: UserDeleteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'The user to create', type: UserCreateRequestDto })
  @ApiCreatedResponse({ description: 'created', type: UserCreateResponseDto })
  async createUser(
    @Body() dto: UserCreateRequestDto,
  ): Promise<UserCreateResponseDto> {
    return this.userCreateUseCase.execute(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deleteUser(@Param('id') id: string): Promise<UserDeleteResponseDto> {
    return this.userDeleteUseCase.execute({ id });
  }
}
