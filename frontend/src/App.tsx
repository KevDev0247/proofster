import './App.css';
import ControlPanel from './components/ControlPanel';
import { AppBar, Toolbar, Typography, Container, Grid } from '@mui/material';
import WorkBench from './components/WorkBench';

function App() {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6">Proofster</Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12} md={12}>
          <Container maxWidth="md">
            <WorkBench />
          </Container>        
        </Grid>
      </Grid>
    </>
  );
}

export default App;
