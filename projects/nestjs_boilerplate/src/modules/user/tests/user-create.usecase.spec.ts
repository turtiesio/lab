import { Test, TestingModule } from '@nestjs/testing';
import { UserCreateUseCase } from '../usecases/user-create.usecase';
import { IUserRepository } from '../infrastructure/repository/user.repo';
import { UserEntity } from '../user.entity';
import { UserCreateRequestDto } from '../usecases/user-create.dto';

describe('UserCreateUseCase', () => {
  let userCreateUseCase: UserCreateUseCase;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateUseCase,
        {
          provide: 'IUserRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userCreateUseCase = module.get<UserCreateUseCase>(UserCreateUseCase);
    userRepository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(userCreateUseCase).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: UserCreateRequestDto = {
      email: 'test@example.com',
      name: 'Test User',
    };
    const userEntity = UserEntity.create(createUserDto);
    (userRepository.save as jest.Mock).mockResolvedValue(userEntity);
    const result = await userCreateUseCase.execute(createUserDto);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(UserEntity));
    expect(result).toEqual({
      id: expect.any(String),
      email: createUserDto.email,
      name: createUserDto.name,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
