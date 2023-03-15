import { createAsyncThunk } from "@reduxjs/toolkit";
import { INormalizeRequest } from "../models/requests";
import { getMetadata, getResults, normalize } from "../network/algorithmApi";
import { 
  nextNormalizeStage, 
  nextPreprocessStage, 
  setNormalizationFinishedStage, 
  setPreprocessingFinishedStage 
} from "../slices/algorithmSlice";


export const AlgorithmService = () => {

  const execute = createAsyncThunk(
    "algorithm/service/algorithm/execute",
    async (request: INormalizeRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const algorithmAction = normalize(request);
      const getStepsAction = getResults({
        workspaceId: request.workspace_id,
        algorithm: request.algorithm
      });
      const getMetadataAction = getMetadata(request.workspace_id);

      await dispatch(algorithmAction);
      if (request.algorithm == 0) {
        dispatch(setNormalizationFinishedStage());
      }
      if (request.algorithm == 1) {
        dispatch(setPreprocessingFinishedStage());
      }      
      
      await dispatch(getStepsAction);
      if (request.algorithm == 0) {
        dispatch(nextNormalizeStage());
      }
      if (request.algorithm == 1) {
        dispatch(nextPreprocessStage());
      }

      dispatch(getMetadataAction);
    }
  );

  return {
    execute
  }
};
