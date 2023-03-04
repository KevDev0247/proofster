import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    disableButton: false,
    showError: false,
    showCacheWarning: false,
    argumentEmpty: true,
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
    }
  },
});

export const { 
  setDisableButton,
  setShowError,
  setShowCacheWarning,
  setArgumentEmpty
} = globalSlice.actions;

export default globalSlice.reducer;