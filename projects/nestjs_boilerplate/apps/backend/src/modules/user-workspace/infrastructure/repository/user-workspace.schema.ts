import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSchema } from '../../../user/infrastructure/repository/user.repo.schema';
import { WorkspaceSchema } from '../../../workspace/infrastructure/repository/workspace.schema';

@Entity('user_workspaces')
export class UserWorkspaceSchema {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  workspaceId: string;

  @ManyToOne(() => UserSchema)
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @ManyToOne(() => WorkspaceSchema)
  @JoinColumn({ name: 'workspaceId' })
  workspace: WorkspaceSchema;

  @Column({ nullable: true })
  role?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
