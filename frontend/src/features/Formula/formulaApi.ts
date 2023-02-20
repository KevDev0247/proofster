import { FORMULA_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../../models/formula";

export const getFormulas = createAsyncThunk(
  "formulas/get", 
  async () => {
    try {
      const response = await FORMULA_API.get("get/workspace/216da6d9-aead-4970-9465-69bfb55d4956")
      return response.data.formulas
    } catch (error) {
      console.log(error);
    }
  }
);

export const createFormula = createAsyncThunk(
  "formula/create",
  async (formula: IFormula) => {
    try {
      const response = await FORMULA_API.post("create/", formula);
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
      const response = await FORMULA_API.patch(`update/${formula.id}`, formula);
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
      const response = await FORMULA_API.delete(`delete/${formulaId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);
