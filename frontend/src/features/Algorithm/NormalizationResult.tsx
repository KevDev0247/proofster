import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { IFormulaResult, INormalized } from './../../models/normalized';
import { getResults } from './algorithmApi';

export default function AlgorithmResult() {
  const dispatch: AppDispatch = useAppDispatch();

  const renderResults = useSelector(
    (state: RootState) => state.algorithm.normalize.renderResults
  );

  useEffect(() => {
    dispatch(getResults('216da6d9-aead-4970-9465-69bfb55d4956'))
  }, []);

  return (
    <>
      {renderResults
        .filter((result: INormalized) => result.formulas.length > 0)
        .map((result: INormalized, resultIndex: number) => (
          <Grid item xs={12} md={12}>
            <Card key={resultIndex} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h5" component="h1" gutterBottom>
                      Step 1
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TableContainer>
                      <Table aria-label="formula table">
                        <TableHead>
                          <TableRow>
                            <TableCell size='small'>
                              <Typography variant="body1" gutterBottom><strong>Type</strong></Typography>
                            </TableCell>
                            <TableCell size='small'>
                              <Typography variant="body1" gutterBottom><strong>Formula</strong></Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {result.formulas?.map((d: IFormulaResult, index: number) => (
                            <TableRow key={index}>
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
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </>
  )
}
