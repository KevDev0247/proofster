import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { Grid, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Button, CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  prompt, nnfSubtitle, pnfSubtitle,
  cnfSubtitle, preprocessSubtitle
} from '../../constants';
import { getResults, normalize } from './algorithmApi';
import {
  nextStage,
  resetStage,
  clearCache,
  setStopStage,
  setCompletedStage
} from './algorithmSlice'

interface Option {
  label: string;
  value: string;
}

export default function AlgorithmControl(props: { showFullControl: boolean }) {
  const { showFullControl } = props;

  const dispatch: AppDispatch = useAppDispatch();

  const options: Option[] = [
    { label: 'Normalize to Negation Normal Form', value: '3' },
    { label: 'Normalize to Prenex Normal Form', value: '6' },
    { label: 'Normalize to Conjunctive Normal Form', value: '8' },
    { label: 'Resolution Proof Preprocessing', value: '9' },
  ];

  const completedStage = useSelector(
    (state: RootState) => state.algorithm.normalize.completedStage
  );
  const currentStage = useSelector(
    (state: RootState) => state.algorithm.normalize.currentStage
  );
  const stopStage = useSelector(
    (state: RootState) => state.algorithm.normalize.stopStage
  );

  const [targetStage, setTargetStage] = useState('');

  const handleOptionChange = (event: SelectChangeEvent) => {
    setTargetStage(event.target.value);
    dispatch(clearCache());
    dispatch(setStopStage(parseInt(event.target.value)));
  };

  const execute = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const normalizeAction = normalize({
      stage: completedStage,
      workspace_id: '216da6d9-aead-4970-9465-69bfb55d4956',
      is_proof: parseInt(targetStage) == 9,
    });

    if (currentStage === completedStage)
      dispatch(normalizeAction)
        .unwrap()
        .then((response: PayloadAction<string>) => {
          toast.success(response.payload);
          dispatch(setCompletedStage())
          dispatch(getResults('216da6d9-aead-4970-9465-69bfb55d4956')).then(() => {
            dispatch(nextStage());
          })
        })
        .catch((error: PayloadAction<string>) => {
          toast.error(error.payload);
        });
    else
      dispatch(nextStage());
  }

  const clear = () => {
    dispatch(clearCache());
  }

  const reset = () => {
    dispatch(resetStage());
  }

  return (
    <>
      {showFullControl ? (
        <>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
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
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} container alignItems="center">
            <Typography variant="caption" component="h1" gutterBottom>
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
            </Typography>
          </Grid>
        </>
      ) : null}
      {(currentStage != stopStage || currentStage == 0) ? (
        <>
          <Grid item xs={6} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={execute}
              disabled={false}
              startIcon={false && <CircularProgress size={20} />}
            >
              {showFullControl ? 'Execute' : 'NEXT'}
            </Button>
          </Grid>
        </>
      ) :
        <>
          <Grid item xs={0.2} md={0.2} container></Grid>
          <Grid item xs={6} md={5.5} container>
            <Typography variant="h6" component="h1" gutterBottom>
              Algorithm Completed!
            </Typography>
          </Grid>
        </>
      }
       <Grid item xs={5.5} md={4.5} container justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={clear}
          disabled={false}
          startIcon={false && <CircularProgress size={20} />}
        >
          Clear Cache
        </Button>
      </Grid>     
      <Grid item xs={5.5} md={1.5} container justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={reset}
          disabled={false}
          startIcon={false && <CircularProgress size={20} />}
        >
          Reset
        </Button>
      </Grid>
    </>
  )
}

