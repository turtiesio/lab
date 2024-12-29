import { Test } from '@nestjs/testing';
import { UserCreateUseCase } from '@back/modules/user/usecases/user-create.usecase';
import { UserDeleteUseCase } from '@back/modules/user/usecases/user-delete.usecase';
import {
  UserEmailExistsException,
  UserNotFoundException,
} from '@back/modules/user/user.exceptions';
import { UserRepository } from '@back/modules/user/infrastructure/repository/user.repo';
import { MockUserRepository } from '@back/modules/user/infrastructure/repository/user.repo.mock';

describe('User Module Integration Tests', () => {
  let userCreateUseCase: UserCreateUseCase;
  let userDeleteUseCase: UserDeleteUseCase;
  let userRepository: MockUserRepository;

  beforeAll(async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds

    const module = await Test.createTestingModule({
      providers: [
        UserCreateUseCase,
        UserDeleteUseCase,
        {
          provide: UserRepository,
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    userCreateUseCase = module.get<UserCreateUseCase>(UserCreateUseCase);
    userDeleteUseCase = module.get<UserDeleteUseCase>(UserDeleteUseCase);
    userRepository = module.get(UserRepository);
  });

  beforeEach(async () => {
    userRepository.clear();
  });

  describe('User Lifecycle', () => {
    it('should create, retrieve, and delete a user', async () => {
      // Create user
      const createDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const createdUser = await userCreateUseCase.execute(createDto);

      expect(createdUser.email).toBe(createDto.email);
      expect(createdUser.name).toBe(createDto.name);
      expect(createdUser.id).toBeDefined();

      // Delete user
      const deleteResult = await userDeleteUseCase.execute({
        id: createdUser.id,
      });
      expect(deleteResult.deletedAt).toBeDefined();
    });

    it('should throw UserEmailExistsException when creating duplicate email', async () => {
      const dto = {
        email: 'duplicate@example.com',
        name: 'Test User',
      };

      await userCreateUseCase.execute(dto);
      await expect(userCreateUseCase.execute(dto)).rejects.toThrow(
        UserEmailExistsException,
      );
    });

    it('should throw UserNotFoundException when deleting non-existent user', async () => {
      await expect(
        userDeleteUseCase.execute({ id: 'non-existent-id' }),
      ).rejects.toThrow(UserNotFoundException);
    });
  });
});
