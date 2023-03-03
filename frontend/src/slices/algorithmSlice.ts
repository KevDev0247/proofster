 /* eslint-disable */
import { createSlice, current } from "@reduxjs/toolkit";
import { getResults, normalize } from "../network/algorithmApi";


export const algorithmSlice = createSlice({
  name: "algorithm",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      error: "",
      currentStage: 0,
      completedStage: 0,
      stopStage: 9,
      cachedResults: [],
      renderResults: []
    },
  },
  reducers: {
    nextStage: (state) => {
      if (state.normalize.currentStage < 9) {
        state.normalize.currentStage += 1;
        var currStage = state.normalize.currentStage;
        var cachedResults = [...current(state.normalize.cachedResults)]
        
        state.normalize.renderResults = [
          ...state.normalize.renderResults,
          cachedResults[currStage - 1]
        ]        
      }
    },
    resetStage: (state) => {
      state.normalize.currentStage = 0;
      state.normalize.renderResults = [];
    },
    clearCache: (state) => {
      state.normalize.cachedResults = [];
      state.normalize.renderResults = [];
      state.normalize.stopStage = 9;
      state.normalize.completedStage = 0;
      state.normalize.currentStage = 0;
      state.normalize.status = "";
      state.normalize.error = "";
    },
    setError: (state, action) => {
      state.normalize.error = action.payload;
    },
    setStopStage: (state, action) => {
      state.normalize.stopStage = action.payload;
    },
    setCompletedStage: (state) => {
      state.normalize.completedStage += 3;
    }
  },
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [normalize.pending.type]: (state, action) => {
      state.normalize.status = "pending";
      state.normalize.isLoading = true;
      state.normalize.error = "";
    },
    [normalize.fulfilled.type]: (state, action) => {
      state.normalize.status = "success";
      state.normalize.isLoading = false;
    },
    [normalize.rejected.type]: (state, action) => {
      state.normalize.status = "failed";
      state.normalize.isLoading = false;
      state.normalize.error = action.payload;
    },
    [getResults.pending.type]: (state, action) => {
      state.normalize.status = "pending";
      state.normalize.isLoading = true;
    },
    [getResults.fulfilled.type]: (state, action) => {
      state.normalize.status = "success";
      state.normalize.isLoading = false;
      state.normalize.cachedResults = action.payload
    },
    [getResults.rejected.type]: (state, action) => {
      state.normalize.status = "failed";
      state.normalize.isLoading = false;
    },
  },
});

export const {
  nextStage, 
  resetStage,
  clearCache,
  setError,
  setStopStage, 
  setCompletedStage
} = algorithmSlice.actions;

export default algorithmSlice.reducer;
