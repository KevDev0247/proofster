import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { createFormula, deleteFormula, getFormulas, updateFormula } from './formulaApi';
import { IFormula } from '../../models/formula';
import { toast } from 'react-toastify';
import Typography from '@material-ui/core/Typography';
import { Edit, Delete } from '@material-ui/icons';
import { Box, Card, CardContent, FormControl, FormControlLabel, CircularProgress, Grid, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Formula() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFormulas());
  }, [dispatch]);

  const formulaList = useSelector(
    (state: RootState) => state.formula.list.values
  );
  const isLoadingTable = useSelector(
    (state: RootState) => state.formula.list.isLoading
  );
  const isSaving = useSelector(
    (state: RootState) => state.formula.save.isSaving
  );
  const isDeleting = useSelector(
    (state: RootState) => state.formula.save.isDeleting
  );

  const [formula, setFormula] = useState<IFormula>({
    id: 0,
    name: "",
    formula_postfix: "",
    formula_result: "",
    is_conclusion: false,
    workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
  });
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormula((prevState) => ({
      ...prevState,
      [name]: name === "is_conclusion" ? checked : value,
    }));
  };

  const selectFormula = (d: IFormula) => {
    setShowValidation(false);
    setFormula({
      id: d.id,
      name: d.name,
      formula_postfix: d.formula_postfix,
      formula_result: d.formula_result,
      is_conclusion: d.is_conclusion,
      workspace_id: d.workspace_id,
    });
  };

  const removeFormula = (id: number) => {
    if (id)
      dispatch(deleteFormula(id))
        .unwrap()
        .then((response) => {
          toast.success(response);
          dispatch(getFormulas());
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formula.name === "") {
      setShowValidation(true);
      return;
    }

    const action =
      formula.id === 0
        ? createFormula(formula)
        : updateFormula(formula)

    dispatch(action)
      .unwrap()
      .then((response) => {
        toast.success(response);
        resetForm();
        dispatch(getFormulas());
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const resetForm = () => {
    setFormula({
      id: 0,
      name: "",
      formula_postfix: "",
      formula_result: "",
      is_conclusion: false,
      workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
    });
    setShowValidation(false);
  };

  return (
    <>
      <div className="form-container">
        <Grid container spacing={4}>
          {isLoadingTable && (
            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item>
                <CircularProgress color="primary" />
              </Grid>
              <Grid item>
                <Typography variant="h6">Fetching...</Typography>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} md={12}>
            <TableContainer component={Paper}>
              <Table aria-label="formula table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>Name</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>Type</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>Formula</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" gutterBottom>Actions</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formulaList?.map((d: IFormula, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body1" gutterBottom>
                          {d.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" gutterBottom>
                          {d.is_conclusion ? "Conclusion" : "Premise"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" gutterBottom>
                          {d.formula_result}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Grid container spacing={1}>
                            <Grid item xs={12} md={4}>
                              <IconButton
                                color="primary"
                                onClick={() => selectFormula(d)}
                                disabled={isSaving || isDeleting}>
                                <Edit />
                              </IconButton>                   
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <IconButton
                                color="secondary"
                                onClick={() => removeFormula(d.id)}
                                disabled={isSaving || isDeleting}>
                                <Delete />
                              </IconButton>                       
                            </Grid>
                          </Grid>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h1" gutterBottom>
                  Input
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
                      placeholder="Enter formula"
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
          </Grid>
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h1" gutterBottom>
                  Control Panel
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  )
}
