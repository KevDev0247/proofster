import { FORMULA_API, NORMALIZER_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  is_proof: boolean;
}

export const normalize = createAsyncThunk(
  "normalizer/nnf",
  async (request: INormalizeRequest) => {
    try {
      const response = await NORMALIZER_API.post("", request);
      return response.data.results;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getResults = createAsyncThunk(
  "normalizer/fetch",
  async (workspaceId: string) => {
    try {
      const response = await FORMULA_API.get(`get/?workspace_id=${workspaceId}`);
      return response.data.formulas;
    } catch (error) {
      console.log(error);
    }
  }
);
