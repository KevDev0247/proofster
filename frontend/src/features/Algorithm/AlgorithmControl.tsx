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
} from '../../strings';
import { getResults, normalize } from './algorithmApi';
import { nextStage, resetStage } from './algorithmSlice'

interface Option {
  label: string;
  value: string;
}

export default function Normalizer() {
  const dispatch: AppDispatch = useAppDispatch();

  const options: Option[] = [
    { label: 'Normalize to Negation Normal Form', value: '3' },
    { label: 'Normalize to Prenex Normal Form', value: '6' },
    { label: 'Normalize to Conjunctive Normal Form', value: '8' },
    { label: 'Resolution Proof Preprocessing', value: '9' },
  ];

  const currentStage = useSelector(
    (state: RootState) => state.algorithm.normalize.currentStage
  );

  const [targetStage, setTargetStage] = useState('');

  useEffect(() => {
    dispatch(getResults('216da6d9-aead-4970-9465-69bfb55d4956'))
  }, [dispatch]);

  const handleOptionChange = (event: SelectChangeEvent) => {
    setTargetStage(event.target.value as string);
  };

  const execute = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const action = normalize({
      stage: parseInt(targetStage),
      workspace_id: '216da6d9-aead-4970-9465-69bfb55d4956',
      is_proof: parseInt(targetStage) == 9,
    });

    dispatch(action)
      .unwrap()
      .then((response: PayloadAction<string>) => {
        toast.success(response.payload);
        dispatch(nextStage());
      })
      .catch((error: PayloadAction<string>) => {
        toast.error(error.payload);
      });
  }

  const reset = () => {
    dispatch(resetStage());
  }

  return (
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
      <Grid item xs={6} md={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={execute}
          disabled={false}
          startIcon={false && <CircularProgress size={20} />}
        >
          Execute
        </Button>
      </Grid>
      <Grid item xs={6} md={6} container justifyContent="flex-end">
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
