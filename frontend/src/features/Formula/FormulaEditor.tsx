import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState, useAppDispatch } from '../../store/store';
import { toast } from 'react-toastify';
import { IFormula } from '../../models/formula';
import { Box, ButtonGroup, Card, CardContent, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { createFormula, getFormulas, updateFormula } from './formulaApi';
import { setShowValidation, setSelected } from './formulaSlice';
import { setDisableButton } from '../../store/globalSlice';
import { readableToInfix } from './formulaService';


interface EditorButton {
  label: string;
  value: string;
}

export default function FormulaEditor() {

  const dispatch: AppDispatch = useAppDispatch();

  const theme: Theme = useTheme();

  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

  const specialSymbolsOne: string[] = ['(', ')', '∀', '∃', '¬']

  const specialSymbolsTwo: string[] = ['∨', '∧', '⇒', '⇔', 'x']

  const isSaving = useSelector(
    (state: RootState) => state.formula.save.isSaving
  );
  const isDeleting = useSelector(
    (state: RootState) => state.formula.save.isDeleting
  );
  const showValidation = useSelector(
    (state: RootState) => state.formula.save.showValidation
  );
  const selected = useSelector(
    (state: RootState) => state.formula.save.selected
  );
  const disableButton = useSelector(
    (state: RootState) => state.global.disableButton
  );

  const [formula, setFormula] = useState<IFormula>(selected);

  const formulaInfixRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormula(selected);
  }, [selected]);

  useEffect(() => {
    if (isSaving || isDeleting)
      dispatch(setDisableButton(true));
    else
      dispatch(setDisableButton(false));
  }, [isSaving, isDeleting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormula((prevState: IFormula) => ({
      ...prevState,
      [name]: name === "is_conclusion" ? checked : value,
    }));
  };

  const handleSymbolSelection = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ) => {
    const inputElement = formulaInfixRef.current;
    if (inputElement) {
      const cursorPosition = inputElement.selectionStart || 0;
      const currentInfix = formula.formula_infix;

      const newInfix = 
        currentInfix.substring(0, cursorPosition) +
        value + 
        currentInfix.substring(cursorPosition);

      setFormula((prevState: IFormula) => ({
        ...prevState,
        formula_infix: newInfix,
      }));

      inputElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    }
  }

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formula.name === "" || formula.formula_infix == "") {
      dispatch(setShowValidation(true));
      return;
    }

    var formulaToSubmit: IFormula = {
      ...formula,
      formula_infix: readableToInfix(formula.formula_infix)
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
      })
      .catch((error: PayloadAction<string>) => {
        toast.error(error.payload);
      });
  };

  const resetForm = () => {
    dispatch(setSelected({
      id: 0,
      name: "",
      formula_postfix: "",
      formula_infix: "",
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
                value={formula.name}
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
                  id="formula_infix"
                  name="formula_infix"
                  label="Formula"
                  variant="outlined"
                  type="text"
                  inputRef={formulaInfixRef}
                  value={formula.formula_infix}
                  onChange={handleInputChange}
                  placeholder="Enter formula here"
                  fullWidth
                  error={showValidation}
                  helperText={showValidation && 'Formula is required'}
                />
              </Grid>
              <Grid item xs={12} md={10} container spacing={1} alignItems="center">
                <Grid item xs={12} md={6}>
                  <ToggleButtonGroup 
                    size="large"
                    onChange={handleSymbolSelection}
                    aria-label="special symbol group one"
                  >
                    {specialSymbolsOne.map((label) => (
                      <ToggleButton key={label} value={label} sx={{ width: 66, textTransform: 'none' }}>
                        <Typography variant="h5"><strong>{label}</strong></Typography>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ToggleButtonGroup 
                    size="large"
                    onChange={handleSymbolSelection}
                    aria-label="special symbol group two"
                  >
                    {specialSymbolsTwo.map((label) => (
                      <ToggleButton key={label} value={label} sx={{ width: 66, textTransform: 'none' }}>
                        <Typography variant="h5"><strong>{label}</strong></Typography>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
              <Grid item xs={12} md={2} container alignItems="center">
                <Grid item xs={12} md={12} container justifyContent="flex-end">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formula.is_conclusion}
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
                {formula.id !== 0 ? "Cancel" : "Reset"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
