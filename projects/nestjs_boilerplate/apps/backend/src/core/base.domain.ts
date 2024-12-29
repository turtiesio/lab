import {
  ClassDataValidatorImpl,
  ClassDataValidator,
} from '@back/core/base.domain.validator';
import { generateId } from '@back/utils/generate-id';
import { IsNullable } from '@back/utils/is-nullable';
import { IsULID } from '@back/utils/is-ulid';
import { IsDate, IsInt, ValidateIf } from 'class-validator';

export type WihtoutFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type ManagedProperties =
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'version';

type PropsConstructor<T> = WihtoutFunctions<T>;
type PropsClone<T> = Partial<WihtoutFunctions<T>>;

type PropsCreate<T> = Omit<WihtoutFunctions<T>, ManagedProperties>;
type PropsRestore<T> = PropsConstructor<T>;

interface BaseDomainInterface<T extends BaseDomainInterface<T>> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class BaseDomain<T extends BaseDomain<T>>
  implements BaseDomainInterface<T>
{
  @IsULID()
  readonly id: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsDate()
  @IsNullable()
  readonly deletedAt: Date | null;

  @IsInt()
  readonly version: number; /** Incremented by 1 on each save(by database) */

  //

  @ValidateIf(() => false)
  private validator: ClassDataValidator;

  public constructor(
    data: PropsConstructor<T>,
    validator: ClassDataValidator = new ClassDataValidatorImpl(),
  ) {
    this.validator = validator;
    this.validator.validate({ data: Object.assign(this, data) });
  }

  protected clone(data: PropsClone<T>): this {
    return new (this.constructor as any)({ ...this, ...data }, this.validator);
  }

  //

  static create<T extends BaseDomain<T>>(
    this: new (data: PropsCreate<T>) => T,
    data: PropsCreate<T>,
    id?: string,
    now?: Date,
  ): T {
    const _id = id ?? generateId();
    const _now = now ?? new Date();

    return new this({
      ...data,
      id: _id,
      createdAt: _now,
      updatedAt: _now,
      deletedAt: null,
      version: 0,
    });
  }

  static restore<U extends BaseDomain<U>>(
    this: new (data: PropsConstructor<U>) => U,
    data: PropsRestore<U>,
  ): U {
    return new this(data);
  }
}
