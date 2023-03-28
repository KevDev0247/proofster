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
import { IWorkspace } from '../../models/workspace';


export default function AlgorithmControl(
  props: {
    isInitialStep: boolean,
    isSmDown: boolean
  }
) {
  const { isInitialStep, isSmDown } = props;

  const dispatch: AppDispatch = useAppDispatch();

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


  const currentWorkspace: IWorkspace = useSelector(
    (state: RootState) => state.global.currentWorkspace
  );
  useEffect(() => {
    if (currentWorkspace.id != "")
      dispatch(
        getMetadataCall(currentWorkspace.id)
      );
  }, [currentWorkspace]);


  const execute = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    const selectedAlgorithm = selectedStage === '9' ? 1 : 0

    if (isInitialStep && selectedStage === '' && metadata.is_transpiled) {
      dispatch(setShowValidation(true));
      return;
    }
    if (argumentEmpty) {
      dispatch(setError(argumentEmptyError));
      return;
    }

    if (!metadata.is_transpiled) {
      dispatch(
        TranspilerService().transpile(currentWorkspace.id)
      );
      return;
    }

    if ((metadata.all_normalized && selectedAlgorithm === 0) ||
      (metadata.is_preprocessed && selectedAlgorithm === 1)) {
      dispatch(
        StepsService().fetchStepsIfAvailable({
          algorithm: selectedAlgorithm,
          workspaceId: currentWorkspace.id
        })
      );
      return;
    }

    if (normalizeCurrent === normalizationCompleted && selectedAlgorithm === 0)
      dispatch(
        AlgorithmService().execute({
          stage: normalizationCompleted,
          workspace_id: currentWorkspace.id,
          algorithm: selectedAlgorithm,
        })
      );
    else if (preprocessCurrent === preprocessingCompleted && selectedAlgorithm === 1)
      dispatch(
        AlgorithmService().execute({
          stage: preprocessingCompleted,
          workspace_id: currentWorkspace.id,
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
    dispatch(
      getMetadataCall(currentWorkspace.id)
    );
  }

  const reset = (): void => {
    dispatch(resetStage());
    dispatch(setShowValidation(false));
  }


  return (
    <>
      {((normalizeCurrent === stopStage && normalizeCurrent !== 0) ||
        (preprocessCurrent === stopStage && preprocessCurrent !== 0)) ? (
        <Grid item xs={5.5} sm={4} md={4} lg={4} container>
          <Alert severity="success">
            Algorithm Completed!
          </Alert>
        </Grid>
      ) :
        <Grid item xs={5.5} sm={4} md={4} lg={4} container>
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
            {!metadata.is_transpiled
              ? 'Transpile'
              : isInitialStep ? 'Execute' : 'Next'
            }
          </Button>
        </Grid>
      }
      <Grid item xs={6.5} sm={8} md={8} lg={8}
        container
        justifyContent="flex-end"
        alignContent="end"
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={clear}
          disabled={disableButton}
          sx={{ 
            height: isSmDown ? 66 : 36,
            width: isSmDown ? 76 : 136
          }}
        >
          Clear Cache
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={reset}
          disabled={disableButton}
          sx={{ 
            height: isSmDown ? 66 : 36,
            width: isSmDown ? 76 : 76,
            marginLeft: 2 
          }}
        >
          Reset
        </Button>
      </Grid>
    </>
  )
}
