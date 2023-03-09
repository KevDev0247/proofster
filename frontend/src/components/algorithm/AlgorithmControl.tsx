import React from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { Alert, Grid } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { getResults, normalize } from '../../network/algorithmApi';
import { setShowCacheWarning, setShowError } from '../../slices/globalSlice';
import { nextPreprocessStage, setPreprocessingCompleted, setShowValidation } from '../../slices/algorithmSlice';
import { argumentEmptyError } from '../../constants';
import {
  nextNormalizeStage, resetStage, clearCache, setError, 
  setNormalizationCompleted,
} from '../../slices/algorithmSlice';


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
  const currentStage: number = useSelector(
    (state: RootState) => state.algorithm.normalize.normalizeCurrent
  );
  const stopStage: number = useSelector(
    (state: RootState) => state.algorithm.normalize.stopStage
  );


  const execute = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    const selectedAlgorithm = selectedStage === '9' ? 1 : 0
    const normalizeAction = normalize({
      stage: normalizationCompleted,
      workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
      algorithm: selectedAlgorithm,
    });
    const preprocessAction = normalize({
      stage: preprocessingCompleted,
      workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
      algorithm: selectedAlgorithm,
    });

    if (isInitialStep && selectedStage === '') {
      dispatch(setShowValidation(true));
      return;
    }
    if (argumentEmpty) {
      dispatch(setError(argumentEmptyError));
      return;
    }

    if (currentStage === normalizationCompleted && selectedAlgorithm === 0)
      dispatch(normalizeAction)
        .unwrap()
        .then((response: PayloadAction<string>) => {
          toast.success(response.payload);
          dispatch(setNormalizationCompleted())
          dispatch(getResults({
            workspaceId: "216da6d9-aead-4970-9465-69bfb55d4956",
            algorithm: 0
          })).then(() => {
            dispatch(nextNormalizeStage());
          });
        })
        .catch((error: PayloadAction<string>) => {
          toast.error(error.payload);
        });
    else if (currentStage === preprocessingCompleted && selectedAlgorithm === 1)
        dispatch(preprocessAction)
        .unwrap()
        .then((response: PayloadAction<string>) => {
          toast.success(response.payload);
          dispatch(setPreprocessingCompleted())
          dispatch(getResults({
            workspaceId: "216da6d9-aead-4970-9465-69bfb55d4956",
            algorithm: 1
          })).then(() => {
            dispatch(nextPreprocessStage());
          });
        })
        .catch((error: PayloadAction<string>) => {
          toast.error(error.payload);
        });
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
      {(currentStage != stopStage || currentStage == 0) ? (
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
            {isInitialStep ? 'Execute' : 'NEXT'}
          </Button>
        </Grid>
      ) :
        <Grid item xs={5.5} sm={6} md={6} container>
          <Alert severity="success">
            Algorithm Completed!
          </Alert>
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
        <Grid item xs={4} sm={4.5} md={4.5} container justifyContent="flex-end">
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
      <Grid item xs={2.5} sm={1.5} md={1.5} container justifyContent="flex-end">
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
