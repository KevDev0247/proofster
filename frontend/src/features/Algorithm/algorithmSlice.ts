 /* eslint-disable */
import { createSlice, current } from "@reduxjs/toolkit";
import { getResults, normalize } from "./algorithmApi";
import { IFormula } from '../../models/formula';

interface IResult {
  name: string,
  formulas: IFormula[]
}

export const algorithmSlice = createSlice({
  name: "normalizer",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      currentStage: -1,
      cachedResults: [] as IResult[],
      renderResults: [] as IResult[]
    },
  },
  reducers: {
    nextStage: (state) => {
      state.normalize.currentStage += 1;
      var currStage = state.normalize.currentStage;
      var cachedResults = [...current(state.normalize.cachedResults)]
      
      state.normalize.renderResults = [
        ...state.normalize.renderResults,
        cachedResults[currStage]
      ]
    },
    resetStage: (state) => {
      state.normalize.currentStage = 0;
      state.normalize.renderResults = [];
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
      
      var formulas: IFormula[] = action.payload
      formulas = formulas.filter((formula: IFormula) => formula.stage !== 0);
      
      var negatedConclusion = { name: "Negated Conclusion", formulas: [] as IFormula[] };
      var removedArrow = { name: "Removed Arrow", formulas: [] as IFormula[] };
      var nnf = { name: "NNF", formulas: [] as IFormula[] };
      var standardized = { name: "Standardized", formulas: [] as IFormula[] };
      var preQuantifier = { name: "Pre-Quantifier", formulas: [] as IFormula[] };
      var pnf = { name: "PNF", formulas: [] as IFormula[] };
      var droppedQuantifier = { name: "Dropped Quantifiers", formulas: [] as IFormula[] };
      var cnf = { name: "CNF", formulas: [] as IFormula[] };
      var clauses = { name: "Clauses", formulas: [] as IFormula[] };

      formulas.forEach((formula: IFormula) => {
        switch (formula.stage) {
          case 1:
            negatedConclusion.formulas.push(formula);
            break;
          case 2:
            removedArrow.formulas.push(formula);
            break;
          case 3:
            nnf.formulas.push(formula);
            break;
          case 4:
            standardized.formulas.push(formula);
            break;
          case 5:
            preQuantifier.formulas.push(formula);
            break;
          case 6:
            pnf.formulas.push(formula);
            break;
          case 7:
            droppedQuantifier.formulas.push(formula)
            break;
          case 8:
            cnf.formulas.push(formula);
            break;
          case 9:
            clauses.formulas.push(formula);
            break;
          default:
        }
      });
      console.log([
        negatedConclusion, removedArrow, nnf,
        standardized, preQuantifier, pnf,
        droppedQuantifier, cnf, clauses
      ])
      state.normalize.cachedResults = [
        negatedConclusion, removedArrow, nnf,
        standardized, preQuantifier, pnf,
        droppedQuantifier, cnf, clauses
      ]
    },
    [getResults.rejected.type]: (state, action) => {
      state.normalize.status = "failed",
      state.normalize.isLoading = false
    },
  },
});

export const { nextStage, resetStage } = algorithmSlice.actions;

export default algorithmSlice.reducer;
