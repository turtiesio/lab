import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryImpl } from '../infrastructure/repository/user.repo';
import { User } from '../user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserSchema } from '../infrastructure/repository/user.repo.schema';
import { Repository } from 'typeorm';
import { UserRepositoryMapperImpl } from '../infrastructure/repository/user.repo.mapper';

describe('UserRepository', () => {
  let userRepository: UserRepositoryImpl;
  let typeOrmRepository: Repository<UserSchema>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        UserRepositoryMapperImpl,
        {
          provide: getRepositoryToken(UserSchema),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    typeOrmRepository = module.get<Repository<UserSchema>>(
      getRepositoryToken(UserSchema),
    );
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('save', () => {
    it('should save a user entity', async () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });
      const userSchema = {
        ...user,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      };
      (typeOrmRepository.save as jest.Mock).mockResolvedValue(userSchema);
      const savedUser = await userRepository.save(user);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          deletedAt: null,
        }),
      );
      expect(savedUser).toBeInstanceOf(User);
      expect(savedUser.id).toBe(user.id);
      expect(savedUser.email).toBe(user.email);
      expect(savedUser.name).toBe(user.name);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });
      const userSchema = {
        ...user,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: null,
      };
      (typeOrmRepository.findOne as jest.Mock).mockResolvedValue(userSchema);
      const foundUser = await userRepository.findById(user.id);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.email).toBe(user.email);
      expect(foundUser?.name).toBe(user.name);
    });

    it('should return null if user is not found', async () => {
      (typeOrmRepository.findOne as jest.Mock).mockResolvedValue(null);
      const foundUser = await userRepository.findById('non-existent-id');
      expect(foundUser).toBeNull();
    });
  });
});
