import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFormula } from "../models/formula";
import { createFormula, deleteFormula, getFormulas, updateFormula } from "../network/formulaApi";
import { setSelected, setShowValidation } from "../slices/formulaSlice";
import { setArgumentEdited } from "../slices/globalSlice";


export const FormulaService = () => {

  const createOrUpdateFormula = createAsyncThunk(
    "algorithm/service/formula/save",
    async (formulaToSubmit: IFormula, thunkAPI) => {
      const { dispatch } = thunkAPI;

      const createOrUpdateAction =
        formulaToSubmit.id === 0
          ? createFormula(formulaToSubmit)
          : updateFormula(formulaToSubmit);

      const getFormulasAction = getFormulas({
        workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956',
        stage: 0
      })
          
      await dispatch(createOrUpdateAction);
      await dispatch(getFormulasAction);
      dispatch(setArgumentEdited(true));

      await dispatch(
        FormulaService().resetCache()
      );
    }
  );

  const removeFormula = createAsyncThunk(
    "algorithm/service/formula/remove",
    async (id: number, thunkAPI) => {
      const { dispatch } = thunkAPI;
      
      const deleteAction = deleteFormula(id);
      const getFormulasAction = getFormulas({
        workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956',
        stage: 0
      })

      await dispatch(deleteAction);
      await dispatch(getFormulasAction);
      dispatch(setArgumentEdited(true));
    }
  );

  const resetCache = createAsyncThunk(
    "algorithm/service/formula/reset",
    async (_, thunkAPI) => {
      const { dispatch } = thunkAPI;

      console.log("reset")

      dispatch(setSelected({
        id: 0,
        name: "",
        formula_postfix: "",
        formula_input: "",
        input_mode: "Infix",
        formula_result: "",
        is_conclusion: false,
        workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
        stage: 0
      }));
      dispatch(setShowValidation(false));
    }
  );

  return {
    createOrUpdateFormula,
    removeFormula,
    resetCache
  }
};