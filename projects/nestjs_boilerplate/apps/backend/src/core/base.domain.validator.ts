import { DomainException } from '@back/core/base.domain.exceptions';
import {
  validateOrReject,
  validateSync,
  ValidatorOptions,
} from 'class-validator';

type Options<T> = {
  data: T;
};

/** Abstract class for domain validator. throws if invalid. */
export abstract class ClassDataValidator {
  abstract validate<T extends object>(options: Options<T>): T;
  abstract validateAsync<T extends object>(options: Options<T>): Promise<T>;
}

/** Concrete implementation of domain validator. */
export class ClassDataValidatorImpl extends ClassDataValidator {
  constructor(private options: ValidatorOptions = {}) {
    super();

    this.options = {
      skipMissingProperties: false,
      forbidNonWhitelisted: true,
      whitelist: true,
      ...this.options,
    };
  }

  validate<T extends object>({ data }: Options<T>): T {
    const errors = validateSync(data, this.options);

    if (errors.length > 0) {
      throw new DomainException(errors);
    }

    return data;
  }

  async validateAsync<T extends object>({ data }: Options<T>): Promise<T> {
    await validateOrReject(data, this.options);

    return data;
  }
}
