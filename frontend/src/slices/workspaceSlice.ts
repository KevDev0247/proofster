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
      selected: {
        id: "",
        name: "",
        user_id: 0,
      },
      showValidation: false,
      formOpened: false,
    },
  },
  reducers: {
    setSelected: (state, action) => {
      state.save.selected = action.payload;
    },
    setShowValidation: (state, action) => {
      state.save.showValidation = action.payload;
    },
    setFormOpened: (state, action) => {
      state.save.formOpened = action.payload;
    }
  },
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
    },
    [createWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [createWorkspaceCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
    },
    [updateWorkspaceCall.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [updateWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [updateWorkspaceCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
    },
    [deleteWorkspaceCall.fulfilled.type]: (state, action) => {
      state.save.isDeleting = false;
    },
    [deleteWorkspaceCall.rejected.type]: (state, action) => {
      state.save.isDeleting = false;
    },
    [deleteWorkspaceCall.pending.type]: (state, action) => {
      state.save.isDeleting = true;
    },
  }
});

export const { 
  setSelected, 
  setShowValidation,
  setFormOpened
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
