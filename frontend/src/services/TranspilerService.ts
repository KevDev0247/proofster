import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalize } from "../network/algorithmApi";
import { setArgumentEdited } from "../slices/globalSlice";

export const TranspilerService = () => {

  const transpile = createAsyncThunk(
    "algorithm/service/transpiler/transpile",
    async (_, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const transpileAction = normalize({
        stage: -1,
        workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
        algorithm: 0,
      });

      await dispatch(transpileAction);
      dispatch(setArgumentEdited(false));
    }
  );

  return {
    transpile
  }
};