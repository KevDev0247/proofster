import { FORMULA_API, NORMALIZER_API } from "../../api";
import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { serverErrorAddOn } from "../../constants";
import { INormalized } from "../../models/normalized";


interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  is_proof: boolean;
}
type NormalizeThunk = AsyncThunk<any, INormalizeRequest, {}>;
type GetResultsThunk = AsyncThunk<INormalized[], string, {}>;


export const normalize: NormalizeThunk = createAsyncThunk(
  "normalizer/nnf",
  async (request: INormalizeRequest, { rejectWithValue }) => {
    try {
      const response = await NORMALIZER_API.post("", request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message + serverErrorAddOn
      );
    }
  }
);

export const getResults: GetResultsThunk = createAsyncThunk(
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
