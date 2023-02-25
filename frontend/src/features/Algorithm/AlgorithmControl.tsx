import React, { useState } from 'react'
import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Button, CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { cnfSubtitle, pnfSubtitle } from '../../strings';
import { nnfSubtitle } from './../../strings';

interface Option {
  label: string;
  value: string;
}

export default function Normalizer() {
  const [selectedOption, setSelectedOption] = useState('');

  const options: Option[] = [
    { label: 'Normalize to Negation Normal Form', value: 'nnf' },
    { label: 'Normalize to Prenex Normal Form', value: 'pnf' },
    { label: 'Normalize to Conjunctive Normal Form', value: 'cnf' },
  ];

  const handleOptionChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel id="algorithm-select">Algorithm</InputLabel>
          <Select
            labelId="algorithm-select"
            id="algorithm-select"
            value={selectedOption}
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
      <Grid item xs={12} md={6} container justifyContent="flex-end">
        <Typography variant="caption" component="h1" gutterBottom>
          {cnfSubtitle}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { }}
          disabled={false}
          startIcon={false && <CircularProgress size={20} />}
        >
          Execute
        </Button>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => { }}
          disabled={false}
          startIcon={false && <CircularProgress size={20} />}
        >
          Reset
        </Button>
      </Grid>
    </>
  )
}
