import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserCreateUseCase } from '../usecases/user-create.usecase';
import {
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserCreateDtoMapper,
} from '../usecases/user-create.dto';
import { User } from '../user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userCreateUseCase: UserCreateUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserCreateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userCreateUseCase = module.get<UserCreateUseCase>(UserCreateUseCase);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should call userCreateUseCase.execute with the provided DTO', async () => {
      const createUserDto: UserCreateRequestDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      await userController.createUser(createUserDto);
      expect(userCreateUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the result of userCreateUseCase.execute', async () => {
      const createUserDto: UserCreateRequestDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const mockUserEntity = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      const expectedResponse: UserCreateResponseDto =
        UserCreateDtoMapper.fromEntity(mockUserEntity);

      (userCreateUseCase.execute as jest.Mock).mockResolvedValue(
        expectedResponse,
      );
      const result = await userController.createUser(createUserDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
