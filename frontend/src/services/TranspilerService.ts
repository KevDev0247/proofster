import { createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeCall } from "../network/algorithmApi";
import { setArgumentEdited } from "../slices/globalSlice";


export const TranspilerService = () => {

  const transpile = createAsyncThunk(
    "algorithm/service/transpiler/transpile",
    async (workspaceId: string, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const transpileAction = normalizeCall({
        stage: -1,
        workspace_id: workspaceId,
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