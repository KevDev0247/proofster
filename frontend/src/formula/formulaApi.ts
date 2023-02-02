import API from "../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "./../models/formula";

export const getFormulas = createAsyncThunk("formula/get", async () => {
  try {
    const response = await API.get("formulas")
    return response.data
  } catch (error) {
    console.log(error);
  }
})

export const createFormula = createAsyncThunk(
  "formula/create",
  async (formula: IFormula) => {
    try {
      const response = await API.post("formulas", formula);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateFormula = createAsyncThunk(
  "formula/update",
  async (formula: IFormula) => {
    try {
      const response = await API.put(`formula/${formula.formulaId}`, formula);
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
);

export const deleteFormula = createAsyncThunk(
  "formula/delete",
  async (formulaId: number) => {
    try {
      const response = await API.delete(`formulas/${formulaId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
