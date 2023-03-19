import { createAsyncThunk } from "@reduxjs/toolkit";
import { INormalizeRequest } from "../models/requests";
import { getMetadataCall, getMetadataListCall, getResultsCall, normalizeCall } from "../network/algorithmApi";
import { 
  nextNormalizeStage, 
  nextPreprocessStage, 
  setNormalizationFinishedStage, 
  setPreprocessingFinishedStage 
} from "../slices/algorithmSlice";


export const AlgorithmService = () => {

  const execute = createAsyncThunk(
    "service/algorithm/execute",
    async (request: INormalizeRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const algorithmAction = normalizeCall(request);
      const getStepsAction = getResultsCall({
        workspaceId: request.workspace_id,
        algorithm: request.algorithm
      });
      const getMetadataAction = getMetadataCall(request.workspace_id);
      const fetchMetadataListAction = getMetadataListCall({});

      await dispatch(algorithmAction);
      if (request.algorithm === 0) {
        dispatch(setNormalizationFinishedStage());
      }
      if (request.algorithm === 1) {
        dispatch(setPreprocessingFinishedStage());
      }      
      
      await dispatch(getStepsAction);
      if (request.algorithm === 0) {
        dispatch(nextNormalizeStage());
      }
      if (request.algorithm === 1) {
        dispatch(nextPreprocessStage());
      }

      await dispatch(getMetadataAction);
      await dispatch(fetchMetadataListAction);
    }
  );

  return {
    execute
  }
};
