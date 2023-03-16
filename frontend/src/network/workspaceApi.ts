import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { WORKSPACE_API } from "../api";
import { IWorkspace } from './../models/workspace';

type GetWorkspacesThunk = AsyncThunk<IWorkspace[], number, {}>;
type SaveWorkspaceThunk = AsyncThunk<any, IWorkspace, {}>;
type DeleteWorkspaceThunk = AsyncThunk<any, number, {}>;


export const getWorkspacesCall: GetWorkspacesThunk = createAsyncThunk(
  "workspaces/get",
  async (userId: number) => {
    try {
      const response = await WORKSPACE_API.get(`get/?user_id=${userId}`);
      return response.data.workspaces
    } catch (error) {
      console.log(error)
    }
  }
);

export const createWorkspaceCall: SaveWorkspaceThunk = createAsyncThunk(
  "workspace/create",
  async (workspace: IWorkspace) => {
    try {
      const response = await WORKSPACE_API.post("create/", workspace);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateFormulaCall: SaveWorkspaceThunk = createAsyncThunk(
  "formula/update",
  async (workspace: IWorkspace) => {
    try {
      const response = await WORKSPACE_API.patch(`update/${workspace.id}`, workspace);
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
);

export const deleteFormulaCall: DeleteWorkspaceThunk = createAsyncThunk(
  "formula/delete",
  async (workspaceId: number) => {
    try {
      const response = await WORKSPACE_API.delete(`delete/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
