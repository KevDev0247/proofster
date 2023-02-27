import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../../store/store';
import { Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { IFormulaResult, INormalized } from './../../models/normalized';
import { getResults } from './algorithmApi';
import AlgorithmControl from './AlgorithmControl';

export default function NormalizationResult() {
  const dispatch: AppDispatch = useAppDispatch();

  const renderResults = useSelector(
    (state: RootState) => state.algorithm.normalize.renderResults
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [renderResults])

  useEffect(() => {
    dispatch(getResults('216da6d9-aead-4970-9465-69bfb55d4956'))
  }, []);

  return (
    <>
      {renderResults
        .map((result: INormalized, resultIndex: number) => (
          <Grid item xs={12} md={12}>
            <Card key={resultIndex} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} container spacing={2}>
                    <Grid item xs={12} md={3.5}>
                      <Alert variant="filled" severity="info" icon={false}>
                        <Typography variant="h6" component="h1">
                          Preprocessing Step {resultIndex + 1}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={8.5}>
                      <Alert variant="outlined" severity="info" icon={false}>
                        <Typography variant="h6" component="h1">
                          {result.stage}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={12} container spacing={1}>
                      <Grid item xs={12} md={12}>
                        <Alert severity="info">
                          {result.description}
                        </Alert>
                      </Grid>
                      {result.formulas.length > 0 ? (
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
                      ) : (
                        <Grid item xs={12} md={12} container justifyContent="center">
                          <Typography variant="h4" component="h1" gutterBottom>
                            Step Not Applicable
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>


                  {resultIndex === renderResults.length - 1 && (
                    <AlgorithmControl showFullControl={false} />
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      <div ref={bottomRef} />
    </>
  )
}