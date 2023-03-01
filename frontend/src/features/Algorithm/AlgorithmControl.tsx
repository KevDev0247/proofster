import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AppDispatch, RootState, useAppDispatch } from '../../store/store';
import { Alert, FormHelperText, Grid, Hidden } from '@mui/material';
import { useTheme, useMediaQuery, Theme } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Button, CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getResults, normalize } from './algorithmApi';
import { setShowCacheWarning } from '../../store/globalSlice';
import {
  nextStage,
  resetStage,
  clearCache,
  setError,
  setStopStage,
  setCompletedStage
} from './algorithmSlice';
import {
  prompt, nnfSubtitle, pnfSubtitle,
  cnfSubtitle, preprocessSubtitle,
  formulaUpdatedWarning, argumentEmptyError
} from '../../constants';

interface Option {
  label: string;
  value: string;
}

export default function AlgorithmControl(props: { showFullControl: boolean }) {
  const { showFullControl } = props;

  const dispatch: AppDispatch = useAppDispatch();

  const theme: Theme = useTheme();

  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

  const options: Option[] = [
    { label: 'Normalize to Negation Normal Form', value: '3' },
    { label: 'Normalize to Prenex Normal Form', value: '6' },
    { label: 'Normalize to Conjunctive Normal Form', value: '8' },
    { label: 'Resolution Proof Preprocessing', value: '9' },
  ];

  const isLoading = useSelector(
    (state: RootState) => state.algorithm.normalize.isLoading
  );
  const completedStage = useSelector(
    (state: RootState) => state.algorithm.normalize.completedStage
  );
  const currentStage = useSelector(
    (state: RootState) => state.algorithm.normalize.currentStage
  );
  const stopStage = useSelector(
    (state: RootState) => state.algorithm.normalize.stopStage
  );
  const error = useSelector(
    (state: RootState) => state.algorithm.normalize.error
  );
  const disableButton = useSelector(
    (state: RootState) => state.global.disableButton
  );
  const showCacheWarning = useSelector(
    (state: RootState) => state.global.showCacheWarning
  );
  const argumentEmpty = useSelector(
    (state: RootState) => state.global.argumentEmpty
  );

  const [targetStage, setTargetStage] = useState('');

  const [showError, setShowError] = useState(false);

  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (error.length != 0)
      setShowError(true);
    else
      setShowError(false);
  }, [error]);

  useEffect(() => {
    if (targetStage != '')
      setShowValidation(false);
  }, [targetStage]);

  const handleOptionChange = (event: SelectChangeEvent) => {
    dispatch(clearCache());
    setTargetStage(event.target.value);
    dispatch(setStopStage(parseInt(event.target.value)));
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCloseWarning = () => {
    dispatch(setShowCacheWarning(false));
  };

  const execute = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const normalizeAction = normalize({
      stage: completedStage,
      workspace_id: '216da6d9-aead-4970-9465-69bfb55d4956',
      is_proof: parseInt(targetStage) == 9,
    });

    if (showFullControl && targetStage === '') {
      setShowValidation(true);
      return;
    }

    if (argumentEmpty) {
      dispatch(setError(argumentEmptyError));
      return;
    }

    if (currentStage === completedStage)
      dispatch(normalizeAction)
        .unwrap()
        .then((response: PayloadAction<string>) => {
          toast.success(response.payload);
          dispatch(setCompletedStage())
          dispatch(getResults('216da6d9-aead-4970-9465-69bfb55d4956')).then(() => {
            dispatch(nextStage());
          });
        })
        .catch((error: PayloadAction<string>) => {
          toast.error(error.payload);
        });
    else
      dispatch(nextStage());
  }

  const clear = () => {
    dispatch(clearCache());
    dispatch(setShowCacheWarning(false));
    setShowError(false);
  }

  const reset = () => {
    dispatch(resetStage());
    setShowValidation(false);
  }

  return (
    <>
      {showError && (
        <Grid item container xs={12} md={12} justifyContent="center">
          <Alert
            onClose={handleCloseError}
            severity="error"
          >
            {error}
          </Alert>
        </Grid>
      )}
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
      {showFullControl ? (
        <>
          <Grid item xs={12} md={5}>
            <FormControl fullWidth error={showValidation}>
              <InputLabel id="algorithm-select">Algorithm</InputLabel>
              <Select
                labelId="algorithm-select"
                id="algorithm-select"
                value={targetStage}
                onChange={handleOptionChange}
                label="Algorithm"
              >
                {options.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {showValidation && (
                <FormHelperText>
                  Please select an algorithm
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7} container alignItems="center">
            <Grid item xs={12} md={12} alignItems="flex-end">
              <Alert severity="info">
                {(() => {
                  switch (targetStage) {
                    case '3':
                      return nnfSubtitle
                    case '6':
                      return pnfSubtitle
                    case '8':
                      return cnfSubtitle
                    case '9':
                      return preprocessSubtitle
                    default:
                      return prompt
                  }
                })()}
              </Alert>
            </Grid>
          </Grid>
        </>
      ) : null}
      {(currentStage != stopStage || currentStage == 0) ? (
        <>
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
              {showFullControl ? 'Execute' : 'NEXT'}
            </Button>
          </Grid>
        </>
      ) :
        <>
          <Grid item xs={5.5} sm={6} md={6} container>
            <Alert severity="success">
              Algorithm Completed!
            </Alert>
          </Grid>
        </>
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
