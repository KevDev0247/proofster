import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { IFormula } from '../../models/formula';
import { Box, Card, CardContent, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { setShowValidation, setSelected } from '../../slices/formulaSlice';
import { setDisableButton } from '../../slices/globalSlice';
import FormulaKeyboard from './FormulaKeyboard';
import { FormulaService } from '../../services/FormulaService';
import { NotationService } from '../../services/NotationService';


interface IKeyboardButton {
  label: string;
  value: string;
}
const keyboardSetting: IKeyboardButton[] = [
  { label: 'Infix', value: 'Infix' },
  { label: 'Postfix', value: 'Postfix' },
  { label: 'Natural', value: 'Natural' },
];

export default function FormulaEditor() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));
  const isMdUp: boolean = useMediaQuery(theme.breakpoints.up('md'));

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

  const formulaInputRef = useRef<HTMLInputElement>(null);
  

  const selectedWorkspaceId: string = useSelector(
    (state: RootState) => state.global.selectedWorkspaceId
  );
  useEffect(() => {
    dispatch(
      setSelected({
        ...selected,
        workspace_id: selectedWorkspaceId,
      })
    );
  }, [selectedWorkspaceId]);

  useEffect(() => {
    if (isSaving || isDeleting)
      dispatch(setDisableButton(true));
    else
      dispatch(setDisableButton(false));
  }, [isSaving, isDeleting]);


  const handleInputModeSelection = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ): void => {
    dispatch(setSelected({
      ...selected,
      input_mode: value,
    }));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked } = e.target;
    dispatch(
      setSelected({
        ...selected,
        [name]: name === "is_conclusion" ? checked : value,
      })
    );
  };

  const submit = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    if (selected.name === "" || selected.formula_input === "") {
      dispatch(setShowValidation(true));
      return;
    }

    var formulaInput = selected.formula_input
    if (selected.input_mode === "Infix") {
      formulaInput = NotationService().infixToEncoded(selected.formula_input)
    }
    var formulaToSubmit: IFormula = {
      ...selected,
      formula_input: formulaInput,
      input_mode: selected.input_mode,
    }

    dispatch(
      FormulaService().createOrUpdateFormula(formulaToSubmit)
    );
  };

  const resetForm = (): void => {
    dispatch(
      FormulaService().resetCache()
    );
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
              <Grid item xs={12} md={10.5} container spacing={1} alignItems="center">
                <FormulaKeyboard
                  formulaInfixRef={formulaInputRef}
                  isSmDown={isSmDown}
                  isMdUp={isMdUp}
                />
              </Grid>
              {isSmDown && (
                <Grid item xs={7.5} container justifyContent="center">
                  <ToggleButtonGroup
                    size="small"
                    value={selected.input_mode}
                    onChange={handleInputModeSelection}
                    aria-label="special symbol group one"
                    exclusive
                  >
                    {keyboardSetting.map(({ label, value }) => (
                      <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                        <Typography variant="body2"><strong>{label}</strong></Typography>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>
              )}
              <Grid item xs={4.5} sm={12} md={1.5} container alignItems="center" justifyContent="flex-end">
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

            <Grid item xs={6} sm={4} md={4} lg={4}>
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
            {!isSmDown && (
              <Grid item xs={12} sm={4} md={4} lg={4} container justifyContent="center">
                <ToggleButtonGroup
                  size="small"
                  value={selected.input_mode}
                  onChange={handleInputModeSelection}
                  aria-label="special symbol group one"
                  exclusive
                >
                  {keyboardSetting.map(({ label, value }) => (
                    <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                      <Typography variant="body2"><strong>{label}</strong></Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
            )}
            <Grid item xs={6} sm={4} md={4} lg={4} container justifyContent="flex-end">
              &nbsp;
              <Button
                variant="outlined"
                style={{ height: isSmDown ? '64px' : undefined }}
                color="primary"
                onClick={resetForm}
                disabled={disableButton}
              >
                {selected.id !== "" ? "Cancel" : "Erase"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
