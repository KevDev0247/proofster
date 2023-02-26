import { FORMULA_API, NORMALIZER_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorAddOn } from "../../constants";

interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  is_proof: boolean;
}

export const normalize = createAsyncThunk(
  "normalizer/nnf",
  async (request: INormalizeRequest, { rejectWithValue }) => {
    try {
      const response = await NORMALIZER_API.post("", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message + errorAddOn
      );
    }
  }
);

export const getResults = createAsyncThunk(
  "normalizer/fetch",
  async (workspaceId: string) => {
    try {
      const response = await FORMULA_API.get(`domain/results?workspace_id=${workspaceId}`);
      return response.data.results;
    } catch (error) {
      console.log(error);
    }
  }
);
