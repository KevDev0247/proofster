import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { IFormula } from '../../models/formula';
import { deleteFormula, getFormulas } from './formulaApi';
import { RootState, useAppDispatch } from '../../store';
import { setShowValidation, setSelected } from './formulaSlice';
import { Edit, Delete } from '@material-ui/icons';
import { toast } from 'react-toastify';
import Typography from '@material-ui/core/Typography';
import { 
  Box,
  CircularProgress, 
  Grid, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from '@material-ui/core';


export default function FormulaTable() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFormulas({ 
      workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956', 
      stage: 0 
    }));
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

  const selectFormula = (d: IFormula) => {
    dispatch(setShowValidation(false));
    dispatch(setSelected({
      id: d.id,
      name: d.name,
      formula_postfix: d.formula_postfix,
      formula_result: d.formula_result,
      is_conclusion: d.is_conclusion,
      workspace_id: d.workspace_id,
      stage: d.stage
    }));
  };

  const removeFormula = (id: number) => {
    if (id)
      dispatch(deleteFormula(id))
        .unwrap()
        .then((response) => {
          toast.success(response);
          dispatch(getFormulas({ 
            workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956', 
            stage: 0 
          }));
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  return (
    <>
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
                          color="primary"
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
    </>
  )
}
