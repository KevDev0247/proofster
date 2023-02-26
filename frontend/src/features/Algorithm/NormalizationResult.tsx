import React from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { IFormula } from '../../models/formula';

interface IResult {
  name: string;
  formulas: IFormula[];
}

export default function AlgorithmResult() {

  const renderResults = useSelector(
    (state: RootState) => state.algorithm.normalize.renderResults
  );

  return (
    <>
      {renderResults
        .filter((result: IResult) => result.formulas.length > 0)
        .map((result: IResult, resultIndex: number) => (
          <Card key={resultIndex} sx={{ boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Algorithm Output
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TableContainer>
                    <Table aria-label="formula table">
                      <TableHead>
                        <TableRow>
                          <TableCell size='small'>
                            <Typography variant="body1" gutterBottom><strong>Name</strong></Typography>
                          </TableCell>
                          <TableCell size='small'>
                            <Typography variant="body1" gutterBottom><strong>Formula</strong></Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.formulas?.map((d: IFormula, index: number) => (
                          <TableRow key={index}>
                            <TableCell size='small'>
                              <Typography variant="body1" gutterBottom>
                                {d.name}
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
      ))}
    </>
  )
}
