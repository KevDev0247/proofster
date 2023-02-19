import './App.css';
import Formula from './features/Formula/Formula';
import { AppBar, Toolbar, Typography, Container } from '@material-ui/core';

function App() {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Proofster</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Formula />
      </Container>
    </>
  );
}

export default App;
