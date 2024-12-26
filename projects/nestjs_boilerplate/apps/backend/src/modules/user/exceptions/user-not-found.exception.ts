import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor({ userId }: { userId: string }) {
    super(`User with ID ${userId} not found`);
  }
}
