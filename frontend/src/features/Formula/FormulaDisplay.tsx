import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Edit from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { Alert, Box, CircularProgress, Grid, IconButton } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { IFormula } from '../../models/formula';
import { deleteFormula, getFormulas } from './formulaApi';
import { RootState, useAppDispatch } from '../../store/store';
import { setShowValidation, setSelected } from './formulaSlice';
import { setShowCacheWarning } from '../../store/globalSlice';
import { formulaUpdatedWarning } from '../../constants';


export default function FormulaDisplay() {
  const dispatch = useAppDispatch();

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
  const isUpdated = useSelector(
    (state: RootState) => state.formula.save.isUpdated
  );
  const showCacheWarning = useSelector(
    (state: RootState) => state.global.showCacheWarning
  );

  useEffect(() => {
    dispatch(getFormulas({
      workspaceId: '216da6d9-aead-4970-9465-69bfb55d4956',
      stage: 0
    }));
  }, [dispatch]);

  useEffect(() => {
    if (isUpdated)
      dispatch(setShowCacheWarning(true));
  }, [isUpdated]);

  const handleCloseWarning = () => {
    dispatch(setShowCacheWarning(false));
  };

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
      <Grid item xs={12} md={12} container justifyContent="center" alignItems="center" spacing={2}>
        {isLoadingTable && (
          <>
            <Grid item>
              <CircularProgress color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="h6">Fetching...</Typography>
            </Grid>
          </>
        )}
      </Grid>
      <Grid item xs={12} md={12}>
        <TableContainer>
          <Table aria-label="formula table">
            <TableHead>
              <TableRow>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom></Typography>
                </TableCell>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom><strong>Name</strong></Typography>
                </TableCell>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom><strong>Type</strong></Typography>
                </TableCell>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom><strong>Formula</strong></Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formulaList?.map((d: IFormula, index: number) => (
                <TableRow key={index}>
                  <TableCell size='small'>
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
                            <DeleteOutlinedIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TableCell>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      {d.name}
                    </Typography>
                  </TableCell>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      {d.is_conclusion ? "Conclusion" : "Premise"}
                    </Typography>
                  </TableCell>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      {d.formula_result}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {showCacheWarning && (
        <Grid item container xs={12} md={12} justifyContent="center">
          <Alert 
            onClose={handleCloseWarning} 
            severity="warning"
          >
            {formulaUpdatedWarning}
          </Alert>
        </Grid>
      )}
    </>
  )
}
