 /* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { getResults, normalize } from "./algorithmApi";
import { IFormula } from '../../models/formula';

export const algorithmSlice = createSlice({
  name: "normalizer",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      currentStage: 0,
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
  },
  reducers: {
    nextStage: (state) => {
      state.normalize.currentStage += 1;
    },
    resetStage: (state) => {
      state.normalize.currentStage = 0;
      state.normalize.stages.forEach((stage) => {
        stage.formulas = [];
      });
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

export const { nextStage, resetStage } = algorithmSlice.actions;

export default algorithmSlice.reducer;
