import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  Module,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserSchema } from '@back/modules/user/infrastructure/repository/user.repo.schema';
import { Repository, DataSource } from 'typeorm';
import { generateId } from '@back/utils/generate-id';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@back/modules/database/database.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserCreateUseCase } from '@back/modules/user/usecases/user-create.usecase';
import { UserDeleteUseCase } from '@back/modules/user/usecases/user-delete.usecase';
import { UserRepositoryProvider } from '@back/modules/user/infrastructure/repository/user.repo';
import { UserControllerV1 } from '@back/modules/user/user.controller.v1';
import { UserModule } from '@back/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...(configService.get<TypeOrmModuleOptions>('database') as object),
        entities: [UserSchema],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserSchema]),
    UserModule,
  ],
})
class TestModule {}

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserSchema>;
  let dataSource: DataSource;

  beforeAll(async () => {
    jest.setTimeout(30000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<UserSchema>>(
      getRepositoryToken(UserSchema),
    );

    dataSource = moduleFixture.get<DataSource>(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
  });

  beforeEach(async () => {
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
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
        version: 1,
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

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(userData);

      expect(response.status).toBe(400);
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
        version: 1,
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
      const response = await request(app.getHttpServer()).delete(
        '/api/v1/users/non-existent-id',
      );

      expect(response.status).toBe(404);
    });
  });
});
