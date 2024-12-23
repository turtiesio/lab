import { UserWorkspaceEntity } from '../../user-workspace.entity';

export interface IUserWorkspaceRepository {
  save(userWorkspace: UserWorkspaceEntity): Promise<UserWorkspaceEntity>;
  findById(id: string): Promise<UserWorkspaceEntity | null>;
  findByUserAndWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<UserWorkspaceEntity | null>;
}
