import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../models/formula";
import { IDeleteFormulaRequest } from "../models/requests";
import { getMetadataCall } from "../network/algorithmApi";
import { createFormulaCall, deleteFormulaCall, getFormulasCall, updateFormulaCall } from "../network/formulaApi";
import { setSelected, setShowValidation } from "../slices/formulaSlice";


export const FormulaService = () => {

  const createOrUpdateFormula = createAsyncThunk(
    "algorithm/service/formula/save",
    async (formulaToSubmit: IFormula, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const createOrUpdateAction =
        formulaToSubmit.id === ""
          ? createFormulaCall(formulaToSubmit)
          : updateFormulaCall(formulaToSubmit);

      const getFormulasAction = getFormulasCall({
        workspaceId: formulaToSubmit.workspace_id,
        stage: 0
      })
      const getMetadataAction = getMetadataCall(formulaToSubmit.workspace_id);
          
      await dispatch(createOrUpdateAction);
      await dispatch(getFormulasAction);
      await dispatch(getMetadataAction);
      await dispatch(
        FormulaService().resetCache()
      );

    }
  );

  const deleteFormula = createAsyncThunk(
    "algorithm/service/formula/remove",
    async (request: IDeleteFormulaRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;
      
      const deleteAction = deleteFormulaCall(request.formulaId);
      const getFormulasAction = getFormulasCall({
        workspaceId: request.workspaceId,
        stage: 0
      })
      const getMetadataAction = getMetadataCall(request.workspaceId);

      await dispatch(deleteAction);
      await dispatch(getFormulasAction);
      await dispatch(getMetadataAction);
    }
  );

  const resetCache = createAsyncThunk(
    "algorithm/service/formula/reset",
    async (_, thunkAPI) => {
      const { dispatch } = thunkAPI;

      console.log("reset")

      dispatch(setSelected({
        id: "",
        name: "",
        formula_postfix: "",
        formula_input: "",
        input_mode: "Infix",
        formula_result: "",
        is_conclusion: false,
        workspace_id: "",
        stage: 0
      }));
      dispatch(setShowValidation(false));
    }
  );

  return {
    createOrUpdateFormula,
    deleteFormula,
    resetCache
  }
};