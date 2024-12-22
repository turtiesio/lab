import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { UserRepository } from './infrastructure/repository/user.repo';
import { UserRepositoryMapper } from './infrastructure/repository/user.repo.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/repository/user.repo.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [
    UserCreateUseCase,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepositoryMapper,
  ],
})
export class UserModule {}
