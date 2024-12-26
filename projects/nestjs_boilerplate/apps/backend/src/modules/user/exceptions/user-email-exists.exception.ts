import { ConflictException } from '@nestjs/common';

export class UserEmailExistsException extends ConflictException {
  constructor({ email }: { email: string }) {
    super(`User with email ${email} already exists`);
  }
}
