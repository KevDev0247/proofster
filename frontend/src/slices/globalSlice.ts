import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWorkspace } from './../models/workspace';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    disableButton: false,
    showError: false,
    showCacheWarning: false,
    argumentEmpty: true,
    argumentEdited: false,
    drawerOpened: true,
    isDashboardPage: false,
    currentWorkspace: {
      id: "",
      name: "",
      user_id: 0,
    },
    currentUserId: 1,
  },
  reducers: {
    setDisableButton: (state, action: PayloadAction<boolean>) => {
      state.disableButton = action.payload;
    },
    setShowError: (state, action: PayloadAction<boolean>) => {
      state.showError = action.payload;
    },
    setShowCacheWarning: (state, action: PayloadAction<boolean>) => {
      state.showCacheWarning = action.payload;
    },
    setArgumentEmpty: (state, action: PayloadAction<boolean>) => {
      state.argumentEmpty = action.payload;
    },
    setArgumentEdited: (state, action: PayloadAction<boolean>) => {
      state.argumentEdited = action.payload;
    },
    setDrawerOpened: (state, action: PayloadAction<boolean>) => {
      state.drawerOpened = action.payload;
    },
    setIsDashboardPage: (state, action: PayloadAction<boolean>) => {
      state.isDashboardPage = action.payload;
    },
    setCurrentWorkspace: (state, action: PayloadAction<IWorkspace>) => {
      state.currentWorkspace = action.payload;
    },
  },
});

export const { 
  setDisableButton,
  setShowError,
  setShowCacheWarning,
  setArgumentEmpty,
  setArgumentEdited,
  setDrawerOpened,
  setIsDashboardPage,
  setCurrentWorkspace
} = globalSlice.actions;

export default globalSlice.reducer;