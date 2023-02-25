import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { createFormula, getFormulas, updateFormula } from './formulaApi';
import { setShowValidation, setSelected } from './formulaSlice';
import { RootState, useAppDispatch } from '../../store';
import { toast } from 'react-toastify';
import { IFormula } from '../../models/formula';
import { Card, CardContent, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Argument Editor
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Checkbox
                title="Conclusion"
                name="is_conclusion"
                value={formula.is_conclusion}
                inputChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Input
                type="text"
                title="Name"
                name="name"
                placeholder="Enter name here"
                value={formula.name}
                inputChange={handleInputChange}
                showValidation={showValidation}
                isRequired={true}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Input
                type="text"
                title="Formula"
                name="formula_postfix"
                placeholder="Enter formula here"
                value={formula.formula_postfix}
                inputChange={handleInputChange}
                showValidation={showValidation}
                isRequired={true}
              />
            </Grid>
            <Grid item xs={6} md={6}>
              <Button
                type="contained"
                loading={isSaving}
                title="Submit"
                color="primary"
                onClick={submit}
                disabled={isSaving || isDeleting}
              />
            </Grid>
            <Grid item xs={6} md={6} container justifyContent="flex-end">
              &nbsp;
              {formula.id !== 0 && (
                <Button
                  type="outlined"
                  title="Cancel"
                  color="primary"
                  onClick={resetForm}
                  disabled={isSaving || isDeleting}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
