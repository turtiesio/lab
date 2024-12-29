import { Test } from '@nestjs/testing';
import { UserCreateUseCase } from '@back/modules/user/usecases/user-create.usecase';
import { UserRepository } from '@back/modules/user/infrastructure/repository/user.repo';
import { UserEmailExistsException } from '@back/modules/user/user.exceptions';
import { User } from '@back/modules/user/user.entity';
import { USER_MODULE } from '@back/modules/user/user.constants';
import { generateId } from '@back/utils/generate-id';

describe('UserCreateUseCase', () => {
  let useCase: UserCreateUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserCreateUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UserCreateUseCase>(UserCreateUseCase);
    userRepository = module.get(UserRepository);
  });

  describe('execute', () => {
    it('should create a new user with valid data', async () => {
      const dto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const expectedUser = User.restore({
        id: generateId(),
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 1,
      });

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(expectedUser);

      const result = await useCase.execute(dto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith({
        email: dto.email,
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(dto.email);
      expect(result.name).toBe(dto.name);
      expect(result.id).toBeDefined();
    });

    it('should throw UserEmailExistsException if email exists', async () => {
      const dto = {
        email: 'existing@example.com',
        name: 'Test User',
      };

      const existingUser = new User({
        id: generateId(),
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 1,
      });

      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(dto)).rejects.toThrow(
        UserEmailExistsException,
      );
    });

    it('should validate email format', async () => {
      const dto = {
        email: 'invalid-email',
        name: 'Test User',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        'email must be an email',
      );
    });

    it('should validate name length', async () => {
      const dto = {
        email: 'test@example.com',
        name: 'A',
      };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        `name must be longer than or equal to ${USER_MODULE.MIN_NAME_LENGTH} characters`,
      );
    });
  });
});
