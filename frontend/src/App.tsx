import './App.css';
import Formula from './features/Formula/Formula';
import { AppBar, Toolbar, Typography, Container, Grid } from '@material-ui/core';

function App() {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6">Proofster</Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={12} md={12}>
          <Container maxWidth="md">
            <Formula />
          </Container>        
        </Grid>
      </Grid>
    </>
  );
}

export default App;
