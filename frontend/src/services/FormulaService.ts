import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../models/formula";
import { IDeleteFormulaRequest } from "../models/requests";
import { getMetadataCall, getMetadataListCall } from "../network/algorithmApi";
import { createFormulaCall, deleteFormulaCall, getFormulasCall, updateFormulaCall } from "../network/formulaApi";
import { setSelected, setShowValidation } from "../slices/formulaSlice";


export const FormulaService = () => {

  const createOrUpdateFormula = createAsyncThunk(
    "service/formula/save",
    async (toSubmit: IFormula, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const createOrUpdateAction =
        toSubmit.id === ""
          ? createFormulaCall(toSubmit)
          : updateFormulaCall(toSubmit);

      const getFormulasAction = getFormulasCall({
        workspaceId: toSubmit.workspace_id,
        stage: 0
      });
      const getMetadataAction = getMetadataCall(toSubmit.workspace_id);
      const fetchMetadataListAction = getMetadataListCall({});
          
      await dispatch(createOrUpdateAction);
      await dispatch(getFormulasAction);
      await dispatch(getMetadataAction);
      await dispatch(fetchMetadataListAction);
      await dispatch(
        FormulaService().resetCache()
      );
    }
  );

  const deleteFormula = createAsyncThunk(
    "service/formula/delete",
    async (request: IDeleteFormulaRequest, thunkAPI) => {
      const { dispatch } = thunkAPI;
      
      const deleteAction = deleteFormulaCall(request.formulaId);
      const getFormulasAction = getFormulasCall({
        workspaceId: request.workspaceId,
        stage: 0
      })
      const getMetadataAction = getMetadataCall(request.workspaceId);
      const fetchMetadataListAction = getMetadataListCall({});

      await dispatch(deleteAction);
      await dispatch(getFormulasAction);
      await dispatch(getMetadataAction);
      await dispatch(fetchMetadataListAction);
    }
  );

  const resetCache = createAsyncThunk(
    "service/formula/reset",
    async (_, thunkAPI) => {
      const { dispatch } = thunkAPI;

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