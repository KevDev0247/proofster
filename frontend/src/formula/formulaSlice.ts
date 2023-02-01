import { createSlice } from "@reduxjs/toolkit";
import { createFormula } from './formulaApi';

export const formulaSlice = createSlice({
    name: "formula",
    initialState: {
        list: {
            isLoading: false,
            status: "",
            values: []
        },
        save: {
            isSaving: false,
            isDeleting: false
        }
    },
    reducers: {
    },
    extraReducers: {
        [createFormula.pending.type]: (state, action) => {
            state.save.isSaving = true
        },
        [createFormula.fulfilled.type]: (state, action) => {
            state.save.isSaving = false
        },
        [createFormula.fulfilled.type]: (state, action) => {
            state.save.isSaving = false
        }
    }
});