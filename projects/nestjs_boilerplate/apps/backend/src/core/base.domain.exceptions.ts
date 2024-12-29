import { ValidationError } from '@nestjs/common';

export class DomainException extends Error {
  constructor(public validationErrors: ValidationError[]) {
    super(
      `Validation failed: ${DomainException.formatErrors(validationErrors)}`,
    );
  }

  private static formatErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.entries(error.constraints)
              .map(([key, value]) => `(${key}: ${value})`)
              .join(', ')
          : '';

        return `${error.property} - ${constraints}`;
      })
      .join('; ');
  }
}
