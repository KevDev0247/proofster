/* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { IFormula } from '../models/formula';
import {
  getFormulas, 
  createFormula,
  updateFormula,
  deleteFormula 
} from "../network/formulaApi";
import { encodedToInfix } from "../utils/encodedToInfix";


export const formulaSlice = createSlice({
  name: "formula",
  initialState: {
    list: {
      isLoading: false,
      status: "",
      values: [],
    },
    save: {
      isSaving: false,
      isDeleting: false,
      isUpdated: false,
      inputMode: "Infix",
      selected: {
        id: 0,
        name: "",
        formula_postfix: "",
        formula_input: "",
        input_mode: "",
        formula_result: "",
        is_conclusion: false,
        workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
        stage: 0
      },
      showValidation: false
    },
  },
  reducers: {
    setInputMode: (state, action) => {
      state.save.inputMode = action.payload;
    },
    setSelected: (state, action) => {
      state.save.selected = action.payload;
    },
    setShowValidation: (state, action) => {
      state.save.showValidation = action.payload;
    },
  },
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [getFormulas.pending.type]: (state, action) => {
      state.list.status = "pending";
      state.list.isLoading = true;
    },
    [getFormulas.fulfilled.type]: (state, action) => {
      state.list.status = "success";
      state.list.isLoading = false;
      
      state.list.values = action.payload
        ? action.payload.map((formula: IFormula) => ({
            ...formula,
            formula_input: formula.input_mode === "Infix" 
                            ? encodedToInfix(formula.formula_input) 
                            : formula.formula_input
          }))
        : [];
    },
    [getFormulas.rejected.type]: (state, action) => {
      state.list.status = "failed";
      state.list.isLoading = false;
    },
    [createFormula.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [createFormula.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [createFormula.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [updateFormula.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [updateFormula.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [updateFormula.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [deleteFormula.fulfilled.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = true;
    },
    [deleteFormula.rejected.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = false;
    },
    [deleteFormula.pending.type]: (state, action) => {
      state.save.isDeleting = true;
      state.save.isUpdated = false;
    },
  },
});

export const {
  setInputMode, 
  setSelected, 
  setShowValidation 
} = formulaSlice.actions;

export default formulaSlice.reducer;
