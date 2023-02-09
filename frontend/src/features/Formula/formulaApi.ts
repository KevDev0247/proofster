import { FORMULA_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../../models/formula";
import AxiosError from "../../errors";

export const getFormulas = createAsyncThunk(
  "formulas/get", 
  async () => {
    try {
      const response = await FORMULA_API.get("216da6d9-aead-4970-9465-69bfb55d4956")
      return response.data.formulas
    } catch (error) {
      console.log((error as AxiosError).config.url);
      console.log(error);
    }
  }
);

export const createFormula = createAsyncThunk(
  "formula/create",
  async (formula: IFormula) => {
    try {
      const response = await FORMULA_API.post("", formula);
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
      const response = await FORMULA_API.put(`formula/${formula.formula_id}`, formula);
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
      const response = await FORMULA_API.delete(`formulas/${formulaId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
