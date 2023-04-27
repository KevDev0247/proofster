import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow
} from '@mui/material';
import AlgorithmControl from './AlgorithmControl';
import { IFormulaResult, IResult } from '../../models/result';
import { getResultsCall } from '../../network/algorithmApi';
import { cnfName, nnfName } from '../../constants';
import { pnfName, preprocessName, defaultName } from '../../constants';
import AlgorithmSelector from './AlgorithmSelector';
import { IWorkspace } from '../../models/workspace';


export default function AlgorithmSteps(
  props: { isSmDown: boolean }
) {
  const { isSmDown } = props;

  const dispatch: AppDispatch = useAppDispatch();

  const renderResults: IResult[] = useSelector(
    (state: RootState) => state.algorithm.normalize.renderResults
  );
  const stopStage: number = useSelector(
    (state: RootState) => state.algorithm.normalize.stopStage
  );


  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [renderResults]);

  const currentWorkspace: IWorkspace = useSelector(
    (state: RootState) => state.global.currentWorkspace
  ); 
  useEffect(() => {
    dispatch(getResultsCall({
      workspaceId: currentWorkspace.id,
      algorithm: 0
    }));
    dispatch(getResultsCall({
      workspaceId: currentWorkspace.id,
      algorithm: 1
    }));
  }, []);


  return (
    <>
      {renderResults
        .map((result: IResult, resultIndex: number) => (
          <Grid key={resultIndex} item xs={12} md={12}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                      <Alert variant="filled" severity="info" icon={false}>
                        <Typography variant="h6" component="h1">
                          {(() => {
                            switch (stopStage) {
                              case 3:
                                return `${nnfName} ${resultIndex + 1}`
                              case 6:
                                return `${pnfName} ${resultIndex + 1}`
                              case 8:
                                return `${cnfName} ${resultIndex + 1}`
                              case 9:
                                return `${preprocessName} ${resultIndex + 1}`
                              default:
                                return defaultName
                            }
                          })()}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                      <Alert variant="outlined" severity="info" icon={false}>
                        <Typography variant="h6" component="h1">
                          {result.stage_name}
                        </Typography>
                      </Alert>
                    </Grid>
                    <Grid item xs={12} md={12} container spacing={1}>
                      <Grid item xs={12} md={12}>
                        <Alert severity="info"  icon={false}>
                          {result.description}
                        </Alert>
                      </Grid>
                      {result.steps.length > 0 ? (
                        <Grid item xs={12} md={12}>
                          <TableContainer>
                            <Table aria-label="formula table">
                              <TableHead>
                                <TableRow>
                                  <TableCell size='small'>
                                    <Typography variant="body1" gutterBottom>
                                      <strong>Type</strong>
                                    </Typography>
                                  </TableCell>
                                  <TableCell size='small'>
                                    <Typography variant="body1" gutterBottom>
                                      <strong>Formula</strong>
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {result.steps?.map((d: IFormulaResult, index: number) => (
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
                          <Typography variant="h5" component="h1" gutterBottom>
                            Step not applicable since argument does not contain a conclusion
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  {resultIndex === renderResults.length - 1 && (
                    <>
                      <AlgorithmSelector />
                      <AlgorithmControl 
                        isInitialStep={false} 
                        isSmDown={isSmDown}
                      />
                    </>
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
