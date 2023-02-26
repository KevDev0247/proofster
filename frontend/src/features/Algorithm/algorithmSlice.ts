 /* eslint-disable */
import { createSlice, current } from "@reduxjs/toolkit";
import { getResults, normalize } from "./algorithmApi";

export const algorithmSlice = createSlice({
  name: "normalizer",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      currentStage: 0,
      completedStage: 0,
      stopStage: 0,
      cachedResults: [],
      renderResults: []
    },
  },
  reducers: {
    nextStage: (state) => {
      state.normalize.currentStage += 1;
      var currStage = state.normalize.currentStage;
      var cachedResults = [...current(state.normalize.cachedResults)]
      
      state.normalize.renderResults = [
        ...state.normalize.renderResults,
        cachedResults[currStage - 1]
      ]
    },
    resetStage: (state) => {
      state.normalize.currentStage = 0;
      state.normalize.renderResults = [];
    },
    setStopStage: (state, action) => {
      state.normalize.stopStage = action.payload
    },
    setCompletedStage: (state) => {
      state.normalize.completedStage += 3
    }
  },
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [normalize.pending.type]: (state, action) => {
      state.normalize.status = "pending",
      state.normalize.isLoading = true
    },
    [normalize.fulfilled.type]: (state, action) => {
      state.normalize.status = "success",
      state.normalize.isLoading = false
    },
    [normalize.rejected.type]: (state, action) => {
      state.normalize.status = "failed",
      state.normalize.isLoading = false
    },
    [getResults.pending.type]: (state, action) => {
      state.normalize.status = "pending",
      state.normalize.isLoading = true
    },
    [getResults.fulfilled.type]: (state, action) => {
      state.normalize.status = "success",
      state.normalize.isLoading = false,
      state.normalize.cachedResults = action.payload
    },
    [getResults.rejected.type]: (state, action) => {
      state.normalize.status = "failed",
      state.normalize.isLoading = false
    },
  },
});

export const { 
  nextStage, 
  resetStage, 
  setStopStage, 
  setCompletedStage 
} = algorithmSlice.actions;

export default algorithmSlice.reducer;
