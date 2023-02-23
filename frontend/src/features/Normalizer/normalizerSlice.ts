 /* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { getResults, normalize } from "./normalizerApi";
import { IFormula } from './../../models/formula';

export const normalizerSlice = createSlice({
  name: "normalizer",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      stages: [
        { name: "Negated Conclusion", formulas: [] as IFormula[] },
        { name: "Removed Arrow", formulas: [] as IFormula[] },
        { name: "NNF", formulas: [] as IFormula[] },
        { name: "Standardized", formulas: [] as IFormula[] },
        { name: "Pre-Quantifier", formulas: [] as IFormula[] },
        { name: "PNF", formulas: [] as IFormula[] },
        { name: "Dropped Quantifiers", formulas: [] as IFormula[] },
        { name: "CNF", formulas: [] as IFormula[] },
        { name: "Clauses", formulas: [] as IFormula[] }
      ]
    },
    currentStage: 0
  },
  reducers: {
    next: (state) => {
      state.currentStage += 1
    },
    reset: (state) => {
      state.currentStage = 0
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
      state.normalize.isLoading = false
      
      const formulas = action.payload
      formulas.forEach((formula: IFormula) => {
        const index = formula.stage;
        state.normalize.stages[index].formulas.push(formula);
      });
    },
    [getResults.rejected.type]: (state, action) => {
      state.normalize.status = "failed",
      state.normalize.isLoading = false
    },
  },
});

export default normalizerSlice.reducer;