import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
import { decodeTime } from 'ulid';

@ValidatorConstraint({ name: 'isUlid', async: false })
export class IsUlidConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    if (typeof text !== 'string') return false;

    // ULID is always 26 characters long
    if (text.length !== 26) return false;

    // ULID uses Crockford's base32 (5 bits per character)
    const validChars = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/i;
    if (!validChars.test(text)) return false;

    try {
      // Check if timestamp part is valid by attempting to decode
      decodeTime(text);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid ULID`;
  }
}

export function IsULID() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUlid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      validator: IsUlidConstraint,
    });
  };
}
