import { Grid, Card, Box, CardContent, Typography } from '@material-ui/core';
import FormulaTable from './../features/Formula/FormulaTable';
import FormulaEditor from './../features/Formula/FormulaEditor';

export default function ControlPanel() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <FormulaEditor />
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="h5" component="h1" gutterBottom>
                  Control Panel
                </Typography>
              </Grid>              
            </Grid>
            <Grid item xs={12} md={12}>
              <FormulaTable />      
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
