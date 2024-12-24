import { User } from '../user.entity';

describe('User', () => {
  it('should create a new user entity', () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(user).toBeInstanceOf(User);
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.deletedAt).toBeNull();
  });

  it("should change the user's name", () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    user.changeName('New Name');
    expect(user.name).toBe('New Name');
    expect(user.updatedAt).toBeDefined();
  });

  it('should mark the user as deleted', () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    user.setDeleted();
    expect(user.deletedAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });
});
