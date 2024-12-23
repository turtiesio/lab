import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserWorkspaceSchema } from '../../../user-workspace/infrastructure/repository/user-workspace.schema';

@Entity('workspaces')
export class WorkspaceSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(
    () => UserWorkspaceSchema,
    (userWorkspace) => userWorkspace.workspace,
  )
  users: UserWorkspaceSchema[];
}
