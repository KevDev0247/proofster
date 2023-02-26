import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    disableButton: false,
    showCacheWarning: false,
  },
  reducers: {
    setDisableButton: (state, action: PayloadAction<boolean>) => {
      state.disableButton = action.payload;
    },
    setShowCacheWarning: (state, action: PayloadAction<boolean>) => {
      state.showCacheWarning = action.payload;
    }
  },
});

export const { 
  setDisableButton,
  setShowCacheWarning
} = globalSlice.actions;

export default globalSlice.reducer;