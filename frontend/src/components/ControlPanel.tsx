import { Grid } from '@material-ui/core';
import FormulaTable from './../features/Formula/FormulaTable';
import FormulaInput from '../features/Formula/FormulaInput';

export default function ControlPanel() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <FormulaInput />
      </Grid>
      <Grid item xs={12} md={12}>
        <FormulaTable />
      </Grid>
    </Grid>
  )
}
