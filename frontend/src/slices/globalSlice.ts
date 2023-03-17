import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    disableButton: false,
    showError: false,
    showCacheWarning: false,
    argumentEmpty: true,
    argumentEdited: false,
    drawerOpened: false,
    selectedWorkspaceId: "",
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
    setSelectedWorkspaceId: (state, action: PayloadAction<string>) => {
      state.selectedWorkspaceId = action.payload;
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
  setSelectedWorkspaceId
} = globalSlice.actions;

export default globalSlice.reducer;