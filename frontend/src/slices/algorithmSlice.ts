 /* eslint-disable */
import { createSlice, current } from "@reduxjs/toolkit";
import { getResults, normalize } from "../network/algorithmApi";
import { getMetaData } from './../network/algorithmApi';


// todo: fetch existing result
export const algorithmSlice = createSlice({
  name: "algorithm",
  initialState: {
    normalize: {
      isLoading: false,
      showValidation: false,
      status: "",
      error: "",
      selectedStage: "",
      normalizeCurrent: 0,
      normalizationCompleted: 0,
      preprocessCurrent: 0,
      preprocessingCompleted: 0,
      stopStage: 9,
      normalizedCached: [],
      preprocessedCached: [],
      renderResults: [],
    },
    metadata: {
      value: {
        workspace_id: "",
        is_transpiled: false,
        all_normalized: false,
        is_preprocessed: false,
      },
    }
  },
  reducers: {
    nextNormalizeStage: (state) => {
      if (state.normalize.normalizeCurrent < 9) {
        state.normalize.normalizeCurrent += 1;
        var currStage = state.normalize.normalizeCurrent;
        var cachedResults = [...current(state.normalize.normalizedCached)]
        
        state.normalize.renderResults = [
          ...state.normalize.renderResults,
          cachedResults[currStage - 1]
        ]
      }
    },
    nextPreprocessStage: (state) => {
      if (state.normalize.preprocessCurrent < 9) {
        state.normalize.preprocessCurrent += 1;
        var currStage = state.normalize.preprocessCurrent;
        var cachedResults = [...current(state.normalize.preprocessedCached)]
        
        state.normalize.renderResults = [
          ...state.normalize.renderResults,
          cachedResults[currStage - 1]
        ]
      }
    },
    resetStage: (state) => {
      state.normalize.normalizeCurrent = 0;
      state.normalize.preprocessCurrent = 0;
      state.normalize.renderResults = [];
      state.normalize.selectedStage = "";
    },
    clearCache: (state) => {
      state.normalize.normalizedCached = [];
      state.normalize.renderResults = [];
      state.normalize.selectedStage = "";
      state.normalize.stopStage = 9;
      state.normalize.normalizationCompleted = 0;
      state.normalize.normalizeCurrent = 0;
      state.normalize.preprocessingCompleted = 0;
      state.normalize.preprocessCurrent = 0;
      state.normalize.status = "";
      state.normalize.error = "";
    },
    setShowValidation: (state, action) => {
      state.normalize.showValidation = action.payload;
    },
    setError: (state, action) => {
      state.normalize.error = action.payload;
    },
    setSelectedStage: (state, action) => {
      state.normalize.selectedStage = action.payload;
    },
    setStopStage: (state, action) => {
      state.normalize.stopStage = action.payload;
    },
    setNormalizationCompleted: (state) => {
      state.normalize.normalizationCompleted += 3;
    },
    setPreprocessingCompleted: (state) => {
      state.normalize.preprocessingCompleted += 3;
    },
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
      
      if (action.payload.algorithm === 0)
        state.normalize.normalizedCached = action.payload.results
      else
        state.normalize.preprocessedCached = action.payload.results
    },
    [getResults.rejected.type]: (state, action) => {
      state.normalize.status = "failed";
      state.normalize.isLoading = false;
    },
    [getMetaData.fulfilled.type]: (state, action) => {
      state.metadata.value = action.payload.results;
    },
  },
});

export const {
  nextNormalizeStage, 
  nextPreprocessStage,
  resetStage,
  clearCache,
  setShowValidation,
  setError,
  setSelectedStage,
  setStopStage, 
  setNormalizationCompleted,
  setPreprocessingCompleted,
} = algorithmSlice.actions;

export default algorithmSlice.reducer;
