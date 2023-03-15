import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  nextNormalizeStage, 
  nextPreprocessStage 
} from "../slices/algorithmSlice";
import { getResults } from "../network/algorithmApi";


export const StepsService = () => {

  const fetchStepsIfAvailable = createAsyncThunk(
    "algorithm/service/steps/fetch",
    async (selectedAlgorithm: number, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const getStepsAction = getResults({
        workspaceId: "216da6d9-aead-4970-9465-69bfb55d4956",
        algorithm: selectedAlgorithm
      });

      await dispatch(getStepsAction);
      if (selectedAlgorithm == 0) {
        dispatch(nextNormalizeStage());
      }
      if (selectedAlgorithm == 1) {
        dispatch(nextPreprocessStage());
      }
    }
  );

  return {
    fetchStepsIfAvailable
  }
};
