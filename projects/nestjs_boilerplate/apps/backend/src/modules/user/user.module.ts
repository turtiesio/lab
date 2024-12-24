import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserCreateUseCase } from './usecases/user-create.usecase';
import { UserRepositoryImpl } from './infrastructure/repository/user.repo';
import { UserRepositoryMapperImpl } from './infrastructure/repository/user.repo.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './infrastructure/repository/user.repo.schema';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  controllers: [UserController],
  providers: [UserCreateUseCase, UserRepositoryImpl, UserRepositoryMapperImpl],
})
export class UserModule {}
