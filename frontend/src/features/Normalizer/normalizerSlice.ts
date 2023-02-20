 /* eslint-disable */
import { createSlice } from "@reduxjs/toolkit";
import { normalize } from "./normalizerApi";

export const normalizerSlice = createSlice({
  name: "normalizer",
  initialState: {
    normalize: {
      isLoading: false,
      status: "",
      negatedConclusion: [],
      removedArrow: [],
      nnf: [],
      standardized: [],
      preQuantifier: [],
      pnf: [],
      droppedQuantifiers: [],
      cnf: [],
      clauses: [],
      stage: 0
    }
  },
  reducers: {
    next: (state) => {
      state.normalize.stage += 1
    },
    reset: (state) => {
      state.normalize.stage = 0
    }
  },
  extraReducers: {
    // Async reducers, mostly calling backend api endpoints
    [normalize.pending.type]: (state, action) => {
      state.normalize.status = "pending",
      state.normalize.isLoading = true
    },
    [normalize.fulfilled.type]: (state, { payload }) => {
      state.normalize.status = "success",
      state.normalize.isLoading = false
    },
    [normalize.rejected.type]: (state, action) => {
      state.normalize.status = "failed",
      state.normalize.isLoading = false
    },
  },
});

export default normalizerSlice.reducer;