import { FORMULA_API } from "../../api";
import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../../models/formula";


interface IGetFormulasParams {
  workspaceId: string;
  stage: number;
}
type GetFormulasThunk = AsyncThunk<IFormula[], IGetFormulasParams, {}>;
type SaveFormulaThunk = AsyncThunk<any, IFormula, {}>;
type DeleteFormulaThunk = AsyncThunk<any, number, {}>;


export const getFormulas: GetFormulasThunk = createAsyncThunk(
  "formulas/get", 
  async (params: IGetFormulasParams) => {
    try {
      const response = await FORMULA_API.get(`get/?workspace_id=${params.workspaceId}&stage=${params.stage}`)
      return response.data.formulas
    } catch (error) {
      console.log(error);
    }
  }
);

export const createFormula: SaveFormulaThunk = createAsyncThunk(
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

export const updateFormula: SaveFormulaThunk = createAsyncThunk(
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

export const deleteFormula: DeleteFormulaThunk = createAsyncThunk(
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
