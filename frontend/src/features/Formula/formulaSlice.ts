 /* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { getFormulas, createFormula, deleteFormula } from "./formulaApi";
import { updateFormula } from './formulaApi';

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
    },
  },
  reducers: {},
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [getFormulas.pending.type]: (state, action) => {
      state.list.status = "pending",
      state.list.isLoading = true
    },
    [getFormulas.fulfilled.type]: (state, { payload }) => {
      state.list.status = "success"
      state.list.values = payload
      state.list.isLoading = false
    },
    [getFormulas.rejected.type]: (state, action) => {
      state.list.status = "failed",
      state.list.isLoading = false
    },
    [createFormula.pending.type]: (state, action) => {
      state.save.isSaving = true;
    },
    [createFormula.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [createFormula.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [updateFormula.fulfilled.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [updateFormula.rejected.type]: (state, action) => {
      state.save.isSaving = false;
    },
    [updateFormula.pending.type]: (state, action) => {
      state.save.isSaving = true;
    },
    [deleteFormula.fulfilled.type]: (state, action) => {
      state.save.isDeleting = false;
    },
    [deleteFormula.rejected.type]: (state, action) => {
      state.save.isDeleting = false;
    },
    [deleteFormula.pending.type]: (state, action) => {
      state.save.isDeleting = true;
    },
  },
});

export default formulaSlice.reducer;
