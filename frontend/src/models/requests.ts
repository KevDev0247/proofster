export interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  algorithm: number;
}
export interface IGetStepsRequest {
  workspaceId: string;
  algorithm: number;
}
