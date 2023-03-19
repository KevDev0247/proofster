import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMetadataCall, getMetadataListCall, normalizeCall } from "../network/algorithmApi";


export const TranspilerService = () => {

  const transpile = createAsyncThunk(
    "service/transpiler/transpile",
    async (workspaceId: string, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const transpileAction = normalizeCall({
        stage: -1,
        workspace_id: workspaceId,
        algorithm: 0,
      });
      const getMetadataAction = getMetadataCall(workspaceId);
      const fetchMetadataListAction = getMetadataListCall({});

      await dispatch(transpileAction);
      await dispatch(getMetadataAction);
      await dispatch(fetchMetadataListAction);
    }
  );

  return {
    transpile
  }
};