import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import { Theme, useTheme } from '@mui/material';
import FormulaDisplay from './formula/FormulaDisplay';
import AlgorithmControl from './algorithm/AlgorithmControl';
import AlgorithmAlerts from './algorithm/AlgorithmAlerts';
import AlgorithmSelector from './algorithm/AlgorithmSelector';


export default function ControlPanel(
  props: { isSmDown: boolean }
) {
  const { isSmDown } = props;

  const theme: Theme = useTheme();

  return (
    <Card
      sx={{ boxShadow: 3 }}
    >
      <Box sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 2,
        pl: 2
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" component="h1">
              Control Panel
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          <FormulaDisplay />
          <AlgorithmAlerts />
          <AlgorithmSelector />
          <AlgorithmControl 
            isInitialStep={true} 
            isSmDown={isSmDown} 
          />
        </Grid>
      </CardContent>
    </Card>
  )
}
