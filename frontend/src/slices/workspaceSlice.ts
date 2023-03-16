import { createSlice } from "@reduxjs/toolkit";
import { 
  createWorkspaceCall, 
  deleteWorkspaceCall, 
  getWorkspacesCall, 
  updateWorkspaceCall 
} from './../network/workspaceApi';

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    list: {
      isLoading: false,
      values: [],
    },
    save: {
      isSaving: false,
      isDeleting: false,
      isUpdated: false,
      selected: {
        id: "",
        name: "",
      },
      showValidation: false,
    },
  },
  reducers: {},
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [getWorkspacesCall.pending.type]: (state, action) => {
      state.list.isLoading = true;
    },
    [getWorkspacesCall.fulfilled.type]: (state, action) => {
      state.list.isLoading = false;
      state.list.values = action.payload
    },
    [getWorkspacesCall.rejected.type]: (state, action) => {
      state.list.isLoading = false;
    },
    [createWorkspaceCall.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [createWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [createWorkspaceCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [updateWorkspaceCall.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [updateWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [updateWorkspaceCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [deleteWorkspaceCall.fulfilled.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = true;
    },
    [deleteWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = false;
    },
    [deleteWorkspaceCall.pending.type]: (state, action) => {
      state.save.isDeleting = true;
      state.save.isUpdated = false;
    },
  }
});

export default workspaceSlice.reducer;
