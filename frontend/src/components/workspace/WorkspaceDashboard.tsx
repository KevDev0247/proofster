import { Theme, useTheme } from '@mui/material';
import { Typography, Grid, Box, CardContent, Card } from '@mui/material';

export default function WorkspaceDashboard() {
  const theme: Theme = useTheme();

  return (
    <Card
    sx={{ boxShadow: 3 }}
  >
    <Box sx={{
      bgcolor: theme.palette.primary.main,
      color: 'white',
      py: 2,
      pl: 2,
    }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" component="h1">
            Dashboard
          </Typography>
        </Grid>
      </Grid>
    </Box>
    <CardContent>
      <Grid container spacing={2}>
      </Grid>
    </CardContent>
  </Card>
  )
}
