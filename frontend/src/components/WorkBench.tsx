import React from 'react'
import FormulaEditor from './../features/Formula/FormulaEditor';
import { Grid } from '@mui/material';
import ControlPanel from './ControlPanel';
import NormalizationResult from '../features/Algorithm/NormalizationResult';


export default function WorkBench() {
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <FormulaEditor />
      </Grid>
      <Grid item xs={12} md={12}>
        <ControlPanel />
      </Grid>
      <NormalizationResult />
    </Grid>
  )
}
