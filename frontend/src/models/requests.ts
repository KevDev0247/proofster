export interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  algorithm: number;
}

export interface IGetStepsRequest {
  workspaceId: string;
  algorithm: number;
}

export interface IDeleteFormulaRequest {
  workspaceId: string;
  formulaId: string;
}

export interface IDeleteWorkspaceRequest {
  workspaceId: string;
  userId: number;
}
