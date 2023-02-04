 /* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { getFormulas, createFormula } from "./formulaApi";

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
      state.list.status = "pending"
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
  },
});

export default formulaSlice.reducer;
