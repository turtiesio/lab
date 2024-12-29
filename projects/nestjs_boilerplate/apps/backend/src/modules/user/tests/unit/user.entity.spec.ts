import { User } from '@back/modules/user/user.entity';
import { USER_MODULE } from '@back/modules/user/user.constants';
import { generateId } from '@back/utils/generate-id';

describe('User Entity', () => {
  const createValidUser = (overrides = {}) => {
    const defaults = {
      id: generateId(),
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      version: 1,
    };

    return new User({ ...defaults, ...overrides });
  };

  describe('Constructor', () => {
    it('should create a valid user with correct properties', () => {
      const id = generateId();
      const email = 'test@example.com';
      const name = 'Test User';
      const createdAt = new Date();
      const updatedAt = new Date();
      const deletedAt = null;
      const version = 1;

      const user = User.restore({
        email,
        name,
        id,
        createdAt,
        updatedAt,
        deletedAt,
        version: 1,
      });

      expect(user.id).toBe(id);
      expect(user.email).toBe(email);
      expect(user.name).toBe(name);
      expect(user.createdAt).toEqual(createdAt);
      expect(user.updatedAt).toEqual(updatedAt);
      expect(user.deletedAt).toBe(deletedAt);
      expect(user.version).toBe(version);
    });
  });

  describe('Validation', () => {
    it('should throw error for invalid email', () => {
      expect(() => createValidUser({ email: 'invalid', name: 'Test' })).toThrow(
        'email must be an email',
      );
    });

    it('should throw error for name shorter than minimum length', () => {
      expect(() =>
        createValidUser({
          email: 'test@example.com',
          name: 'A',
        }),
      ).toThrow(
        `name must be longer than or equal to ${USER_MODULE.MIN_NAME_LENGTH} characters`,
      );
    });

    it('should throw error for name longer than maximum length', () => {
      const longName = 'A'.repeat(USER_MODULE.MAX_NAME_LENGTH + 1);
      expect(() =>
        createValidUser({
          email: 'test@example.com',
          name: longName,
        }),
      ).toThrow(
        `name must be shorter than or equal to ${USER_MODULE.MAX_NAME_LENGTH} characters`,
      );
    });

    it('should throw error for invalid id', () => {
      expect(() =>
        User.create(
          { email: 'test@example.com', name: 'name' },
          'invalid-ulid',
        ),
      ).toThrow('id must be a valid ULID');
    });

    it('should throw error for invalid deletedAt', () => {
      expect(() =>
        User.restore({
          id: generateId(),
          email: 'test@example.com',
          name: 'name',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: 'invalid-date' as unknown as Date,
          version: 1,
        }),
      ).toThrow('deletedAt must be a Date instance');
    });
  });

  describe('Domain Methods', () => {
    let user: User;

    beforeEach(() => {
      user = User.create({
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    describe('changeName', () => {
      it('should update the name', () => {
        const newName = 'New Name';
        const updatedUser = user.changeName({
          name: newName,
          now: new Date(Date.now() + 1000),
        });

        expect(updatedUser.name).toBe(newName);
        expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(
          user.updatedAt.getTime(),
        );
      });

      it('should throw error for invalid name', () => {
        expect(() => user.changeName({ name: 'A' })).toThrow(
          `name must be longer than or equal to ${USER_MODULE.MIN_NAME_LENGTH} characters`,
        );
      });
    });

    describe('markAsDeleted', () => {
      it('should mark user as deleted', () => {
        const deletedUser = user.markAsDeleted({
          now: new Date(Date.now() + 1000),
        });

        expect(deletedUser.deletedAt).toBeInstanceOf(Date);
        expect(deletedUser.updatedAt.getTime()).toBeGreaterThan(
          user.updatedAt.getTime(),
        );
      });
    });
  });
});
