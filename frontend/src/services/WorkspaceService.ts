import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDeleteWorkspaceRequest } from "../models/requests";
import { createWorkspaceCall, deleteWorkspaceCall } from "../network/workspaceApi";
import { setSelected, setShowValidation } from "../slices/workspaceSlice";
import { IWorkspace } from './../models/workspace';
import { updateWorkspaceCall, getWorkspacesCall } from './../network/workspaceApi';

export const WorkspaceService = () => {

  const createOrUpdateWorkspace = createAsyncThunk(
    "service/workspace/save",
    async (toSubmit: IWorkspace, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const createOrUpdateAction = 
        toSubmit.id === ""
          ? createWorkspaceCall(toSubmit)
          : updateWorkspaceCall(toSubmit);

      const getWorkspacesAction = getWorkspacesCall(toSubmit.user_id);

      await dispatch(createOrUpdateAction);
      await dispatch(getWorkspacesAction);
      await dispatch(
        WorkspaceService().resetCache()
      )
    }
  );

  const deleteWorkspace = createAsyncThunk(
    "service/workspace/delete",
    async (request: IDeleteWorkspaceRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const deleteAction = deleteWorkspaceCall(request.workspaceId);
      const getWorkspacesAction = getWorkspacesCall(request.userId);

      await dispatch(deleteAction);
      await dispatch(getWorkspacesAction);
    }
  );

  const resetCache = createAsyncThunk(
    "service/workspace/reset",
    async (_, thunkAPI) => {
      const { dispatch } = thunkAPI;

      dispatch(setSelected({
        id: "",
        name: "",
        user_id: ""
      }));
      dispatch(setShowValidation(false));
    }
  );

  return {
    createOrUpdateWorkspace,
    deleteWorkspace,
    resetCache
  }
};
