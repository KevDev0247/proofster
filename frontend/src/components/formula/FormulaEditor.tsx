import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { toast } from 'react-toastify';
import { IFormula } from '../../models/formula';
import { Box, Card, CardContent, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { createFormula, getFormulas, updateFormula } from '../../network/formulaApi';
import { setShowValidation, setSelected } from '../../slices/formulaSlice';
import { setDisableButton } from '../../slices/globalSlice';
import { readableToInfix } from '../../utils/infixConverter';


interface SymbolButton {
  label: string;
  value: string;
}
const keyboardOne: SymbolButton[] = [
  { label: '(', value: ' ( ' },
  { label: ')', value: ' ) ' },
  { label: '¬', value: ' ¬ ' },    
  { label: '∀', value: ' ∀' },
  { label: '∃', value: ' ∃' },
];
const keyboardTwo: SymbolButton[] = [
  { label: '∨', value: ' ∨ ' },
  { label: '∧', value: ' ∧ ' },
  { label: '⇒', value: ' ⇒ ' },
  { label: '⇔', value: ' ⇔ ' },
  { label: 'F(x)', value: ' F( ) ' },
];


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
  const [formula, setFormula] = useState<IFormula>(selected);

  useEffect(() => {
    setFormula(selected);
  }, [selected]);

  useEffect(() => {
    if (isSaving || isDeleting)
      dispatch(setDisableButton(true));
    else
      dispatch(setDisableButton(false));
  }, [isSaving, isDeleting]);


  const formulaInfixRef = useRef<HTMLInputElement>(null); 
  const cursorPositionRef = useRef<number>(0);

  useEffect(() => {
    const handleCursorPositionChange = () => {
      const newCursorPosition = formulaInfixRef.current?.selectionStart || 0;
      cursorPositionRef.current = newCursorPosition;
    };
    if (formulaInfixRef.current) {
      formulaInfixRef.current.addEventListener('click', handleCursorPositionChange);
      formulaInfixRef.current.addEventListener('keyup', handleCursorPositionChange);
      return () => {
        formulaInfixRef.current?.removeEventListener('click', handleCursorPositionChange);
        formulaInfixRef.current?.removeEventListener('keyup', handleCursorPositionChange);
      };
    }
  }, []);

  const handleKeyboardClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ): void => {
    const inputElement = formulaInfixRef.current;
    if (inputElement) {
      const cursorPosition = cursorPositionRef.current;
      const currentInfix = formula.formula_infix;

      const newInfix = 
        currentInfix.substring(0, cursorPosition) +
        value + 
        currentInfix.substring(cursorPosition);

      setFormula((prevState: IFormula) => ({
        ...prevState,
        formula_infix: newInfix,
      }));

      const newCursorPosition = cursorPosition + value.length;
      cursorPositionRef.current = newCursorPosition;
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked } = e.target;
    setFormula((prevState: IFormula) => ({
      ...prevState,
      [name]: name === "is_conclusion" ? checked : value,
    }));
    cursorPositionRef.current = e.target.selectionStart || 0;
  };  

  const submit = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    if (formula.name === "" || formula.formula_infix === "") {
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

  const resetForm = (): void => {
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
    cursorPositionRef.current = 0;
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
              <Grid item xs={12} md={10} container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  {isSmDown ? (
                    <ToggleButtonGroup 
                      size="large"
                      onChange={handleKeyboardClick}
                      aria-label="special symbol group one"
                      exclusive
                    >
                      {keyboardOne.map(({ label, value }) => (
                        <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                          <Typography variant="h5"><strong>{label}</strong></Typography>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  ) : (
                    <ToggleButtonGroup 
                      size="small"
                      onChange={handleKeyboardClick}
                      aria-label="special symbol group one"
                      exclusive
                    >
                      {keyboardOne.map(({ label, value }) => (
                        <ToggleButton key={label} value={value} sx={{ width: 46, textTransform: 'none' }}>
                          <Typography variant="body1"><strong>{label}</strong></Typography>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {isSmDown ? (
                    <ToggleButtonGroup 
                      size="large"
                      onChange={handleKeyboardClick}
                      aria-label="special symbol group two"
                      exclusive
                    >
                      {keyboardTwo.map(({ label, value }) => (
                        <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                          <Typography variant="h5"><strong>{label}</strong></Typography>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  ) : (
                    <ToggleButtonGroup 
                      size="small"
                      onChange={handleKeyboardClick}
                      aria-label="special symbol group two"
                      exclusive
                    >
                      {keyboardTwo.map(({ label, value }) => (
                        <ToggleButton key={label} value={value} sx={{ width: 46, textTransform: 'none' }}>
                          <Typography variant="body1"><strong>{label}</strong></Typography>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
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
                {formula.id !== 0 ? "Cancel" : "Erase"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
