import { Test, TestingModule } from '@nestjs/testing';
import { UserDeleteUseCase } from '../usecases/user-delete.usecase';
import { UserRepository } from '../infrastructure/repository/user.repo';
import { User } from '../user.entity';
import { UserDeleteRequestDto } from '../usecases/user-delete.dto';

describe('UserDeleteUseCase', () => {
  let userDeleteUseCase: UserDeleteUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDeleteUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    userDeleteUseCase = module.get<UserDeleteUseCase>(UserDeleteUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userDeleteUseCase).toBeDefined();
  });

  it('should delete a user', async () => {
    const deleteUserDto: UserDeleteRequestDto = {
      id: 'some-ulid',
    };
    const userEntity = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    (userRepository.findById as jest.Mock).mockResolvedValue(userEntity);
    (userRepository.save as jest.Mock).mockResolvedValue(userEntity);
    await userDeleteUseCase.execute(deleteUserDto);
    expect(userRepository.findById).toHaveBeenCalledWith(deleteUserDto.id);
    expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw an error if user is not found', async () => {
    const deleteUserDto: UserDeleteRequestDto = {
      id: 'non-existent-id',
    };
    (userRepository.findById as jest.Mock).mockResolvedValue(null);
    await expect(userDeleteUseCase.execute(deleteUserDto)).rejects.toThrowError(
      'User not found',
    );
  });
});
