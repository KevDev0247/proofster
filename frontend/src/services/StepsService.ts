import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  nextNormalizeStage, 
  nextPreprocessStage 
} from "../slices/algorithmSlice";
import { getResultsCall } from "../network/algorithmApi";
import { IGetStepsRequest } from "../models/requests";


export const StepsService = () => {

  const fetchStepsIfAvailable = createAsyncThunk(
    "service/step/fetch",
    async (request: IGetStepsRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const getStepsAction = getResultsCall(request);

      await dispatch(getStepsAction);
      if (request.algorithm === 0) {
        dispatch(nextNormalizeStage());
      }
      if (request.algorithm === 1) {
        dispatch(nextPreprocessStage());
      }
    }
  );

  return {
    fetchStepsIfAvailable
  }
};
