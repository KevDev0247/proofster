import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { toast } from 'react-toastify';
import { IFormula } from '../../models/formula';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { createFormula, getFormulas, updateFormula } from '../../network/formulaApi';
import { setShowValidation, setSelected } from '../../slices/formulaSlice';
import { setArgumentEdited, setDisableButton } from '../../slices/globalSlice';
import FormulaKeyboard from './FormulaKeyboard';
import { infixToEncoded } from '../../utils/infixToEncoded';


export default function FormulaEditor() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

  const disableButton: boolean = useSelector(
    (state: RootState) => state.global.disableButton
  );
  const isSaving: boolean = useSelector(
    (state: RootState) => state.formula.save.isSaving
  );
  const isDeleting: boolean = useSelector(
    (state: RootState) => state.formula.save.isDeleting
  );
  const showValidation: boolean = useSelector(
    (state: RootState) => state.formula.save.showValidation
  );
  const selected: IFormula = useSelector(
    (state: RootState) => state.formula.save.selected
  );
  const inputMode: string = useSelector(
    (state: RootState) => state.formula.save.inputMode
  )

  const formulaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSaving || isDeleting)
      dispatch(setDisableButton(true));
    else
      dispatch(setDisableButton(false));
  }, [isSaving, isDeleting]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked } = e.target;
    dispatch(setSelected({
      ...selected,
      [name]: name === "is_conclusion" ? checked : value,
    }));
  };

  const submit = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    if (selected.name === "" || selected.formula_input === "") {
      dispatch(setShowValidation(true));
      return;
    }

    var formulaInput = selected.formula_input
    if (inputMode === "Infix") {
      formulaInput = infixToEncoded(selected.formula_input)
    }
    var formulaToSubmit: IFormula = {
      ...selected,
      formula_input: formulaInput,
      input_mode: inputMode,
    }

    const action =
      formulaToSubmit.id === 0
        ? createFormula(formulaToSubmit)
        : updateFormula(formulaToSubmit)

    dispatch(action)
      .unwrap()
      .then((response: PayloadAction<string>) => {
        toast.success(response.payload);
        resetForm();
        dispatch(getFormulas({
          workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956',
          stage: 0
        }));
        dispatch(setArgumentEdited(true));
      })
      .catch((error: PayloadAction<string>) => {
        toast.error(error.payload);
      });
  };

  const resetForm = (): void => {
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
  };


  return (
    <>
      <Card
        sx={{ boxShadow: 3 }}
      >
        <Box sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 2,
          pl: 2
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography variant="h6" component="h1">
                Argument Editor
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                type="text"
                value={selected.name}
                onChange={handleInputChange}
                placeholder="Enter name here"
                fullWidth
                error={showValidation}
                helperText={showValidation && 'Name is required'}
              />
            </Grid>
            <Grid item xs={12} md={12} container spacing={1}>
              <Grid item xs={12} md={12}>
                <TextField
                  id="formula_input"
                  name="formula_input"
                  label="Formula"
                  variant="outlined"
                  type="text"
                  inputRef={formulaInputRef}
                  value={selected.formula_input}
                  onChange={handleInputChange}
                  placeholder="Enter formula here"
                  fullWidth
                  error={showValidation}
                  helperText={showValidation && 'Formula is required'}
                />
              </Grid>
              <Grid item xs={12} md={10} container spacing={2} alignItems="center">
                <FormulaKeyboard
                  formulaInfixRef={formulaInputRef}
                  isSmDown={isSmDown}
                />
              </Grid>
              <Grid item xs={12} md={2} container alignItems="center" justifyContent="flex-end">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selected.is_conclusion}
                      name="is_conclusion"
                      color="primary"
                      onChange={handleInputChange}
                    />
                  }
                  label="Conclusion"
                  labelPlacement="start"
                />
              </Grid>
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                variant="contained"
                style={{ height: isSmDown ? '64px' : undefined }}
                color="primary"
                onClick={submit}
                disabled={disableButton}
                startIcon={
                  isSaving &&
                  <CircularProgress color="secondary" size={20} />
                }
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={6} md={6} container justifyContent="flex-end">
              &nbsp;
              <Button
                variant="outlined"
                style={{ height: isSmDown ? '64px' : undefined }}
                color="primary"
                onClick={resetForm}
                disabled={disableButton}
              >
                {selected.id !== 0 ? "Cancel" : "Erase"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
