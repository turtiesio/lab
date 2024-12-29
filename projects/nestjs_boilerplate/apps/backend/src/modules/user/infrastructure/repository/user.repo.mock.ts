import { User } from '../../user.entity';
import { UserRepository } from './user.repo';
import { generateId } from '../../../../utils/generate-id';

type MockUserSchema = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
};

export class MockUserRepository implements UserRepository {
  private users: Map<string, MockUserSchema>;

  constructor(initialUsers: User[] = []) {
    this.users = new Map();
    initialUsers.forEach((user) => {
      this.users.set(user.id, this.toSchema(user));
    });
  }

  async save({ user }: { user: User }): Promise<User> {
    const existingUser = this.users.get(user.id);
    const now = new Date();

    const userSchema: MockUserSchema = existingUser
      ? {
          ...existingUser,
          ...this.toSchema(user),
          updatedAt: now,
          version: existingUser.version + 1,
        }
      : {
          ...this.toSchema(user),
          createdAt: now,
          updatedAt: now,
          version: 1,
          id: user.id ?? generateId(),
        };

    this.users.set(userSchema.id, userSchema);
    return this.toDomain(userSchema);
  }

  async findById({
    id,
    includeDeleted,
  }: {
    id: string;
    includeDeleted?: boolean;
  }): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }
    if (!includeDeleted && user.deletedAt) {
      return null;
    }
    return this.toDomain(user);
  }

  async findByEmail({ email }: { email: string }): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return this.toDomain(user);
      }
    }
    return null;
  }

  clear(): void {
    this.users.clear();
  }

  addOrUpdateUser(user: User): void {
    this.users.set(user.id, this.toSchema(user));
  }

  toDomain(schema: MockUserSchema): User;
  toDomain(schema: MockUserSchema | null): User | null;
  toDomain(schema: MockUserSchema | null): User | null {
    return schema ? User.restore({ ...schema }) : null;
  }

  toSchema(domain: User): MockUserSchema {
    return {
      id: domain.id,
      email: domain.email,
      name: domain.name,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      deletedAt: domain.deletedAt,
      version: 1,
    };
  }
}
