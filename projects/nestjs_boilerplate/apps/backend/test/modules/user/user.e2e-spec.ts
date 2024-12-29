import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '@back/app.module';
import { UserSchema } from '@back/modules/user/infrastructure/repository/user.repo.schema';
import { Repository } from 'typeorm';
import { generateId } from '@back/utils/generate-id';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserSchema>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432', 10),
          username: process.env.DATABASE_USERNAME || 'postgres',
          password: process.env.DATABASE_PASSWORD || 'password',
          database: process.env.DATABASE_NAME || 'test_db',
          entities: [UserSchema],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<UserSchema>>(
      getRepositoryToken(UserSchema),
    );
    await app.init();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.email).toBe(userData.email);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.id).toBeDefined();

      const savedUser = await userRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedUser).toBeDefined();
      expect(savedUser!.email).toBe(userData.email);
    });

    it('should return 409 if email already exists', async () => {
      const existingUser = {
        id: generateId(),
        email: 'existing@example.com',
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      await userRepository.save(existingUser);

      const userData = {
        email: 'existing@example.com',
        name: 'New User',
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData)
        .expect(409);
    });

    it('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });

    it('should validate name length', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'A',
      };

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should soft delete a user', async () => {
      const user = {
        id: generateId(),
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      await userRepository.save(user);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/users/${user.id}`)
        .expect(200);

      expect(response.body.deletedAt).toBeDefined();

      const deletedUser = await userRepository.findOne({
        where: { id: user.id },
        withDeleted: true,
      });
      expect(deletedUser?.deletedAt).toBeDefined();
    });

    it('should return 404 if user does not exist', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/users/non-existent-id')
        .expect(404);
    });
  });
});
