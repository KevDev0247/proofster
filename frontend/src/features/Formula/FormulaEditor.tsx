import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { createFormula, getFormulas, updateFormula } from './formulaApi';
import { setShowValidation, setSelected } from './formulaSlice';
import { RootState, useAppDispatch } from '../../store';
import { toast } from 'react-toastify';
import { IFormula } from '../../models/formula';
import { Box, Card, CardContent, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

export default function FormulaEditor() {
  const dispatch = useAppDispatch();

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
  const [formula, setFormula] = useState<IFormula>(selected);

  useEffect(() => {
    setFormula(selected);
  }, [selected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormula((prevState) => ({
      ...prevState,
      [name]: name === "is_conclusion" ? checked : value,
    }));
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formula.name === "") {
      setShowValidation(true);
      return;
    }

    const action =
      selected.id === 0
        ? createFormula(formula)
        : updateFormula(formula)

    dispatch(action)
      .unwrap()
      .then((response) => {
        toast.success(response);
        resetForm();
        dispatch(getFormulas({
          workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956',
          stage: 0
        }));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const resetForm = () => {
    dispatch(setSelected({
      id: 0,
      name: "",
      formula_postfix: "",
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
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Argument Editor
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
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
              />
            </Grid>
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
            <Grid item xs={12} md={12}>
              <TextField
                id="formula_postfix"
                name="formula_postfix"
                label="Formula"
                variant="outlined"
                type="text"
                value={formula.formula_postfix}
                onChange={handleInputChange}
                placeholder="Enter formula here"
                fullWidth
                error={showValidation}
                helperText={showValidation && 'Formula is required'}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={submit}
                disabled={isSaving || isDeleting}
                startIcon={isSaving && <CircularProgress size={20} />}
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={6} md={6} container justifyContent="flex-end">
              &nbsp;
              {formula.id !== 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={resetForm}
                  disabled={isSaving || isDeleting}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
