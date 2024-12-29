import {
  ClassDataValidatorImpl,
  ClassDataValidator,
} from '@back/core/base.domain.validator';
import { generateId } from '@back/utils/generate-id';
import { IsULID } from '@back/utils/is-ulid';
import { IsDate } from 'class-validator';

type WihtoutFunctions<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

type ManagedProperties = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

type PropsConstructor<T> = WihtoutFunctions<T>;
type PropsCreate<T> = Omit<WihtoutFunctions<T>, ManagedProperties>;
type PropsUpdate<T> = Partial<PropsCreate<T>>;
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
  readonly deletedAt: Date | null;

  //

  /** Do not use this constructor directly. Use `create` or `restore` instead. */
  /** I could not find way to make this private and still have a good typing experience. */
  public constructor(
    data: PropsConstructor<T>,
    private validator: ClassDataValidator = new ClassDataValidatorImpl(),
  ) {
    this.validator.validate({ data: Object.assign(this, data) });
  }

  //

  protected softDelete(): this {
    return this.validator.validate({
      data: Object.assign(this, {
        deletedAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  protected update(data: PropsUpdate<T>): this {
    return this.validator.validate({
      data: Object.assign(this, data, { updatedAt: new Date() }),
    });
  }

  protected async updateAsync(data: PropsUpdate<T>): Promise<this> {
    return this.validator.validateAsync({
      data: Object.assign(this, data, { updatedAt: new Date() }),
    });
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
    });
  }

  static restore<U extends BaseDomain<U>>(
    this: new (data: PropsConstructor<U>) => U,
    data: PropsRestore<U>,
  ): U {
    return new this(data);
  }
}
