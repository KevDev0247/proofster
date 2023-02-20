import { FORMULA_API, NORMALIZER_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IGetFormulasParams } from "../../models/requests";

interface INormalizer {
  stage: number;
  workspace_id: string;
  is_proof: boolean;
}

export const normalize = createAsyncThunk(
  "normalizer/nnf",
  async (normalizer: INormalizer) => {
    try {
      const response = await NORMALIZER_API.post("", normalizer);
      return response.data.results;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getResults = createAsyncThunk(
  "normalizer/fetch",
  async (params: IGetFormulasParams) => {
    try {
      const response = await FORMULA_API.get(
        `get/?workspace_id=${params.workspaceId}&stage=${params.stage}`
      );
      return response.data.formulas;
    } catch (error) {
      console.log(error);
    }
  }
);
