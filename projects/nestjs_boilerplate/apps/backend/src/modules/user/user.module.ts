import { Module } from '@nestjs/common';
import { UserControllerV1 } from './user.controller.v1';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { UserRepositoryImpl } from './infrastructure/repository/user.repo';
import { UserRepositoryMapperImpl } from './infrastructure/repository/user.repo.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/repository/user.repo.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserControllerV1],
  providers: [UserCreateUseCase, UserRepositoryImpl, UserRepositoryMapperImpl],
})
export class UserModule {}
