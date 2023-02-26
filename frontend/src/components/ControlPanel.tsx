import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import FormulaDisplay from '../features/Formula/FormulaDisplay';
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
          <FormulaDisplay />
          <AlgorithmControl showFullControl={true} />
        </Grid>
      </CardContent>
    </Card>
  )
}
