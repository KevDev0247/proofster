import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Edit from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress, Grid, Hidden, IconButton } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { IFormula } from '../../models/formula';
import { getFormulasCall } from '../../network/formulaApi';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { setShowValidation, setSelected } from '../../slices/formulaSlice';
import { setShowCacheWarning, setArgumentEmpty } from '../../slices/globalSlice';
import { FormulaService } from '../../services/FormulaService';
import { IWorkspace } from '../../models/workspace';


export default function FormulaDisplay() {
  const dispatch: AppDispatch = useAppDispatch();

  const isLoadingTable: boolean = useSelector(
    (state: RootState) => state.formula.list.isLoading
  );
  const isSaving: boolean = useSelector(
    (state: RootState) => state.formula.save.isSaving
  );
  const isDeleting: boolean = useSelector(
    (state: RootState) => state.formula.save.isDeleting
  );


  const currentWorkspace: IWorkspace = useSelector(
    (state: RootState) => state.global.currentWorkspace
  ); 
  useEffect(() => {
    if (currentWorkspace.id != "")
      dispatch(
        getFormulasCall({
          workspaceId: currentWorkspace.id,
          stage: 0
        })
      );
  }, [currentWorkspace]);

  const isUpdated: boolean = useSelector(
    (state: RootState) => state.formula.save.isUpdated
  );
  useEffect(() => {
    if (isUpdated)
      dispatch(setShowCacheWarning(true));
  }, [isUpdated]);

  const formulaList: IFormula[] = useSelector(
    (state: RootState) => state.formula.list.values
  );
  useEffect(() => {
    if (formulaList.length === 0)
      dispatch(setArgumentEmpty(true));
    else
      dispatch(setArgumentEmpty(false));
  }, [formulaList]);


  const selectFormula = (d: IFormula): void => {
    dispatch(setShowValidation(false));
    dispatch(setSelected({
      id: d.id,
      name: d.name,
      formula_postfix: d.formula_postfix,
      formula_input: d.formula_input,
      input_mode: d.input_mode,
      formula_result: d.formula_result,
      is_conclusion: d.is_conclusion,
      workspace_id: d.workspace_id,
      stage: d.stage
    }));
  };

  const removeFormula = (id: string): void => {
    if (id)
      dispatch(
        FormulaService().deleteFormula({
          workspaceId: currentWorkspace.id,
          formulaId: id
        })
      );
  };


  return (
    <>
      <Grid item xs={12} md={12}>
        <TableContainer>
          <Table aria-label="formula table">
            <TableHead>
              <TableRow>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom></Typography>
                </TableCell>
                <Hidden smDown>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      <strong>Name</strong>
                    </Typography>
                  </TableCell>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      <strong>Type</strong>
                    </Typography>
                  </TableCell>
                </Hidden>
                <TableCell size='small'>
                  <Typography variant="body1" gutterBottom>
                    <strong>Formula</strong>
                  </Typography>
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
                            disabled={isSaving || isDeleting}
                          >
                            <Edit />
                          </IconButton>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <IconButton
                            color="primary"
                            onClick={() => removeFormula(d.id)}
                            disabled={isSaving || isDeleting}
                          >
                            <DeleteOutlinedIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TableCell>
                  <Hidden smDown>
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
                  </Hidden>
                  <TableCell size='small'>
                    <Typography variant="body1" gutterBottom>
                      {d.formula_input}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {formulaList.length === 0 && (
        <Grid item xs={12} md={12} 
          container 
          justifyContent="center" 
          alignItems="center" 
          spacing={2}
        >
          <Grid item>
            <Typography variant="body1">No formulas in this argument</Typography>
          </Grid>
        </Grid>
      )}
      {isLoadingTable && (
        <Grid item xs={12} md={12} 
          container 
          justifyContent="center" 
          alignItems="center" 
          spacing={2}
        >
          <Grid item>
            <CircularProgress color="primary" />
          </Grid>
          <Grid item>
            <Typography variant="h6">Fetching...</Typography>
          </Grid>
        </Grid>
      )}
    </>
  )
}
