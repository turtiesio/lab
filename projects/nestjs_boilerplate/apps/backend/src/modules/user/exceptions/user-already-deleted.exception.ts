import { ConflictException } from '@nestjs/common';

export class UserAlreadyDeletedException extends ConflictException {
  constructor({ userId }: { userId: string }) {
    super(`User with ID ${userId} is already deleted`);
  }
}
