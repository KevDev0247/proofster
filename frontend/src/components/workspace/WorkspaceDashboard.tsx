import { Theme, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={12}>
            <Alert severity="warning">
              <AlertTitle><strong>Workspace 1</strong></AlertTitle>
              Fully preprocessed but <strong>not normalized</strong>
            </Alert>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Alert severity="success">
            <AlertTitle><strong>Workspace 2</strong></AlertTitle>
              Fully preprocessed and normalized
            </Alert>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Alert severity="error">
            <AlertTitle><strong>Workspace 3</strong></AlertTitle>
            Not transpiled! Click <strong>TRANSPILE</strong> button
            </Alert>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
