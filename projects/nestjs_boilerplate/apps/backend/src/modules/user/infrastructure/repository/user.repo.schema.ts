import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserWorkspaceSchema } from '@back/modules/user-workspace/infrastructure/repository/user-workspace.schema';

@Entity('users')
export class UserSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => UserWorkspaceSchema, (userWorkspace) => userWorkspace.user)
  workspaces: UserWorkspaceSchema[];
}
