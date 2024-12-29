import { Test } from '@nestjs/testing';
import { UserDeleteUseCase } from '@back/modules/user/usecases/user-delete.usecase';
import { UserRepository } from '@back/modules/user/infrastructure/repository/user.repo';
import { UserNotFoundException } from '@back/modules/user/user.exceptions';
import { User } from '@back/modules/user/user.entity';
import { generateId } from '@back/utils/generate-id';

describe('UserDeleteUseCase', () => {
  let useCase: UserDeleteUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

    useCase = module.get<UserDeleteUseCase>(UserDeleteUseCase);
    userRepository = module.get(UserRepository);
  });

  describe('execute', () => {
    it('should soft delete an existing user', async () => {
      const userId = generateId();
      const user = new User({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 1,
      });

      userRepository.findById.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user.markAsDeleted({}));

      const result = await useCase.execute({ id: userId });

      expect(userRepository.findById).toHaveBeenCalledWith({ id: userId });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.id).toBe(userId);
      expect(result.deletedAt).toBeDefined();
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const userId = 'non-existent-id';
      userRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute({ id: userId })).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
