import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import FormulaTable from './../features/Formula/FormulaTable';
import AlgorithmControl from '../features/Algorithm/AlgorithmControl';

export default function ControlPanel() {
  return (
    <Card
      sx={{ boxShadow: 3 }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h5" component="h1" gutterBottom>
              Control Panel
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormulaTable />
          </Grid>
          <AlgorithmControl />
        </Grid>
      </CardContent>
    </Card>
  )
}
