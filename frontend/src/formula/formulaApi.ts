import API from "../api";
import { createAsyncThunk } from "@reduxjs/toolkit"
import { IFormula } from './../models/formula';

export const createFormula = createAsyncThunk("formula/create", async (formula: IFormula) => {
    try {
        const response = await API.post("formulas", formula);
        return response.data;
    } catch (error) {
        console.log(error);
    }
})