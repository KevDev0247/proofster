import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    disableButton: false,
    showCacheWarning: false,
    argumentEmpty: true,
  },
  reducers: {
    setDisableButton: (state, action: PayloadAction<boolean>) => {
      state.disableButton = action.payload;
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
  setShowCacheWarning,
  setArgumentEmpty
} = globalSlice.actions;

export default globalSlice.reducer;