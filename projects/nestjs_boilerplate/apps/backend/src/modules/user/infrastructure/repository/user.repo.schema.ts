import { BaseSchema } from '@back/core/base.schema';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('users')
export class UserSchema extends BaseSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;
}
