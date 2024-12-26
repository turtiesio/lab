import { ConflictException, NotFoundException } from '@nestjs/common';

export class UserEmailExistsException extends ConflictException {
  constructor({ email }: { email: string }) {
    super(`User with email ${email} already exists`);
  }
}

export class UserAlreadyDeletedException extends ConflictException {
  constructor({ userId }: { userId: string }) {
    super(`User with ID ${userId} is already deleted`);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor({ userId }: { userId: string }) {
    super(`User with ID ${userId} not found`);
  }
}
