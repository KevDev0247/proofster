import FormulaEditor from './formula/FormulaEditor';
import { Grid } from '@mui/material';
import ControlPanel from './ControlPanel';
import NormalizationResult from './algorithm/NormalizationResult';


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
