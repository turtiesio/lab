import { Module } from '@nestjs/common';
import { UserControllerV1 } from './user.controller.v1';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { UserRepositoryProvider } from './infrastructure/repository/user.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/repository/user.repo.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserControllerV1],
  providers: [UserCreateUseCase, UserRepositoryProvider],
})
export class UserModule {}
