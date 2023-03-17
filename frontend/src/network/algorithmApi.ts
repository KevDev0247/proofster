import { NORMALIZER_API } from "../api";
import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { serverErrorAddOn } from "../constants";
import { IGetStepsRequest, INormalizeRequest } from "../models/requests";

type NormalizeThunk = AsyncThunk<any, INormalizeRequest, {}>;
type GetResultsThunk = AsyncThunk<any, IGetStepsRequest, {}>;
type GetMetadataThunk = AsyncThunk<any, string, {}>;


export const normalizeCall: NormalizeThunk = createAsyncThunk(
  "network/algorithm/nnf",
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

export const getResultsCall: GetResultsThunk = createAsyncThunk(
  "network/algorithm/fetch",
  async (request: IGetStepsRequest) => {
    try {
      const response = await NORMALIZER_API.get("", {
        params: {
          workspace_id: request.workspaceId,
          algorithm: request.algorithm,
        },
      });
      return {
        results: response.data.data.results,
        algorithm: request.algorithm
      };
    } catch (error) {
      console.log(error);
    }
  }
);

export const getMetadataCall: GetMetadataThunk = createAsyncThunk(
  "network/algorithm/metadata",
  async (workspaceId: string) => {
    try {
      const response = await NORMALIZER_API.get("/metadata", {
        params: {
          workspace_id: workspaceId,
        },
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);
