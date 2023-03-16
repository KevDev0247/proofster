import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { Alert, Grid } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { getMetadataCall } from '../../network/algorithmApi';
import { 
  setShowCacheWarning, 
  setShowError 
} from '../../slices/globalSlice';
import { 
  nextPreprocessStage, 
  setShowValidation 
} from '../../slices/algorithmSlice';
import {
  nextNormalizeStage, resetStage, clearCache, setError,
} from '../../slices/algorithmSlice';
import { argumentEmptyError } from '../../constants';
import { IMetadata } from './../../models/metadata';
import { StepsService } from './../../services/StepsService';
import { TranspilerService } from '../../services/TranspilerService';
import { AlgorithmService } from './../../services/AlgorithmService';


export default function AlgorithmControl(props: { isInitialStep: boolean }) {
  const { isInitialStep } = props;

  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

  const disableButton: boolean = useSelector(
    (state: RootState) => state.global.disableButton
  );
  const argumentEmpty: boolean = useSelector(
    (state: RootState) => state.global.argumentEmpty
  );
  const argumentEdited: boolean = useSelector(
    (state: RootState) => state.global.argumentEdited
  );
  const isLoading: boolean = useSelector(
    (state: RootState) => state.algorithm.normalize.isLoading
  );
  const selectedStage: string = useSelector(
    (state: RootState) => state.algorithm.normalize.selectedStage
  );
  const normalizationCompleted: number = useSelector(
    (state: RootState) => state.algorithm.normalize.normalizationCompleted
  );
  const preprocessingCompleted: number = useSelector(
    (state: RootState) => state.algorithm.normalize.preprocessingCompleted
  );
  const normalizeCurrent: number = useSelector(
    (state: RootState) => state.algorithm.normalize.normalizeCurrent
  );
  const preprocessCurrent: number = useSelector(
    (state: RootState) => state.algorithm.normalize.preprocessCurrent
  );
  const stopStage: number = useSelector(
    (state: RootState) => state.algorithm.normalize.stopStage
  );
  const metadata: IMetadata = useSelector(
    (state: RootState) => state.algorithm.metadata.value
  );

  useEffect(() => {
    dispatch(getMetadataCall("216da6d9-aead-4970-9465-69bfb55d4956"));
  }, []);

  // todo: workspace feature
  const execute = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    const selectedAlgorithm = selectedStage === '9' ? 1 : 0

    if (isInitialStep && selectedStage === '' && !argumentEdited) {
      dispatch(setShowValidation(true));
      return;
    }
    if (argumentEmpty) {
      dispatch(setError(argumentEmptyError));
      return;
    }

    if (argumentEdited) {
      dispatch(
        TranspilerService().transpile()
      );
      return;
    }

    if ((metadata.all_normalized && selectedAlgorithm === 0) || 
        (metadata.is_preprocessed && selectedAlgorithm === 1)) {
      dispatch(
        StepsService().fetchStepsIfAvailable(selectedAlgorithm)
      );
      return;
    }

    if (normalizeCurrent === normalizationCompleted && selectedAlgorithm === 0)
      dispatch(
        AlgorithmService().execute({
          stage: normalizationCompleted,
          workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
          algorithm: selectedAlgorithm,
        })
      );
    else if (preprocessCurrent === preprocessingCompleted && selectedAlgorithm === 1)
      dispatch(
        AlgorithmService().execute({
          stage: preprocessingCompleted,
          workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
          algorithm: selectedAlgorithm,
        })
      );
    else
      if (selectedAlgorithm === 0)
        dispatch(nextNormalizeStage());
      else
        dispatch(nextPreprocessStage());
  }

  const clear = (): void => {
    dispatch(clearCache());
    dispatch(setShowCacheWarning(false));
    dispatch(setShowError(false));
    dispatch(setShowValidation(false));
  }

  const reset = (): void => {
    dispatch(resetStage());
    dispatch(setShowValidation(false));
  }


  return (
    <>
      {((normalizeCurrent === stopStage && normalizeCurrent !== 0) ||
        (preprocessCurrent === stopStage && preprocessCurrent !== 0)) ? (
        <Grid item xs={5.5} sm={6} md={6} container>
          <Alert severity="success">
            Algorithm Completed!
          </Alert>
        </Grid>
      ) :
        <Grid item xs={5.5} md={6} container>
          <Button
            variant="contained"
            color="primary"
            onClick={execute}
            disabled={disableButton}
            startIcon={
              isLoading &&
              <CircularProgress color="secondary" size={20} />
            }
          >
            {argumentEdited ?
              'Transpile'
              : isInitialStep ? 'Execute' : 'Next'
            }
          </Button>
        </Grid>
      }
      {isSmDown ? (
        <Grid item xs={4} container>
          <Button
            variant="outlined"
            color="primary"
            onClick={clear}
            disabled={disableButton}
          >
            Clear Cache
          </Button>
        </Grid>
      ) : (
        <Grid item xs={4} sm={4.5} md={4.5} lg={5} container justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            onClick={clear}
            disabled={disableButton}
          >
            Clear Cache
          </Button>
        </Grid>
      )}
      <Grid item xs={2.5} sm={1.5} md={1.5} lg={1} container justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={reset}
          disabled={disableButton}
        >
          Reset
        </Button>
      </Grid>
    </>
  )
}
