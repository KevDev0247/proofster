import './App.css';
import ControlPanel from './components/ControlPanel';
import { AppBar, Toolbar, Typography, Container, Grid } from '@mui/material';
import FormulaEditor from './components/formula/FormulaEditor';
import NormalizationResult from './components/algorithm/NormalizationResult';

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
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <FormulaEditor />
              </Grid>
              <Grid item xs={12} md={12}>
                <ControlPanel />
              </Grid>
              <NormalizationResult />
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </>
  );
}

export default App;
