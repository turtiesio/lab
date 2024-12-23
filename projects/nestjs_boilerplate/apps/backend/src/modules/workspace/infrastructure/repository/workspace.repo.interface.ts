import { WorkspaceEntity } from '../../workspace.entity';

export interface IWorkspaceRepository {
  save(workspace: WorkspaceEntity): Promise<WorkspaceEntity>;
  findById(id: string): Promise<WorkspaceEntity | null>;
}
