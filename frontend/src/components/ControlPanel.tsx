import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import { useTheme, Theme } from '@mui/material';
import FormulaDisplay from '../features/Formula/FormulaDisplay';
import AlgorithmControl from '../features/Algorithm/AlgorithmControl';


export default function ControlPanel() {
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
          <AlgorithmControl showFullControl={true} />
        </Grid>
      </CardContent>
    </Card>
  )
}
