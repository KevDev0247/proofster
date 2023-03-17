/* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { IFormula } from "../models/formula";
import {
  getFormulasCall,
  createFormulaCall,
  updateFormulaCall,
  deleteFormulaCall,
} from "../network/formulaApi";
import { NotationService } from "../services/NotationService";

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
      selected: {
        id: "",
        name: "",
        formula_postfix: "",
        formula_input: "",
        input_mode: "Infix",
        formula_result: "",
        is_conclusion: false,
        workspace_id: "",
        stage: 0,
      },
      showValidation: false,
    },
  },
  reducers: {
    setSelected: (state, action) => {
      state.save.selected = action.payload;
    },
    setShowValidation: (state, action) => {
      state.save.showValidation = action.payload;
    },
  },
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [getFormulasCall.pending.type]: (state, action) => {
      state.list.status = "pending";
      state.list.isLoading = true;
    },
    [getFormulasCall.fulfilled.type]: (state, action) => {
      state.list.status = "success";
      state.list.isLoading = false;

      state.list.values = action.payload
        ? action.payload.map((formula: IFormula) => ({
            ...formula,
            formula_input:
              formula.input_mode === "Infix"
                ? NotationService().encodedToInfix(formula.formula_input)
                : formula.formula_input,
          }))
        : [];
    },
    [getFormulasCall.rejected.type]: (state, action) => {
      state.list.status = "failed";
      state.list.isLoading = false;
    },
    [createFormulaCall.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [createFormulaCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [createFormulaCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [updateFormulaCall.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = true;
    },
    [updateFormulaCall.rejected.type]: (state, action) => {
      state.save.isSaving = false;
      state.save.isUpdated = false;
    },
    [updateFormulaCall.pending.type]: (state, action) => {
      state.save.isSaving = true;
      state.save.isUpdated = false;
    },
    [deleteFormulaCall.fulfilled.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = true;
    },
    [deleteFormulaCall.rejected.type]: (state, action) => {
      state.save.isDeleting = false;
      state.save.isUpdated = false;
    },
    [deleteFormulaCall.pending.type]: (state, action) => {
      state.save.isDeleting = true;
      state.save.isUpdated = false;
    },
  },
});

export const { setSelected, setShowValidation } = formulaSlice.actions;

export default formulaSlice.reducer;
