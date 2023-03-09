import { FORMULA_API, NORMALIZER_API } from "../api";
import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { serverErrorAddOn } from "../constants";
import { INormalized } from "../models/normalized";


interface INormalizeRequest {
  stage: number;
  workspace_id: string;
  algorithm: number;
}
interface IGetStepsRequest {
  workspaceId: string;
  algorithm: number;
}
type NormalizeThunk = AsyncThunk<any, INormalizeRequest, {}>;
type GetResultsThunk = AsyncThunk<any, IGetStepsRequest, {}>;


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
  async (request: IGetStepsRequest) => {
    try {
      const response = await NORMALIZER_API.get("", {
        params: {
          workspace_id: request.workspaceId,
          algorithm: request.algorithm,
        },
      });
      console.log(response)
      return {
        results: response.data.data.results,
        algorithm: request.algorithm
      };
    } catch (error) {
      console.log(error);
    }
  }
);
