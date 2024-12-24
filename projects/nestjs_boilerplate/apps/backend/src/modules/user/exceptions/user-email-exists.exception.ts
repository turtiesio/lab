import { ConflictException } from '@nestjs/common';

export class UserEmailExistsException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
