import './App.css';
import { Theme, useTheme } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import { 
  AppBar, Toolbar, Typography, Container, 
  Grid, Box, CardContent, Card 
} from '@mui/material';

import FormulaEditor from './components/formula/FormulaEditor';
import AlgorithmSteps from './components/algorithm/AlgorithmSteps';
import WorkspacesDrawer from './components/workspace/WorkspacesDrawer';


function App() {
  const theme: Theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Proofster
          </Typography>
        </Toolbar>
      </AppBar>
      <WorkspacesDrawer />
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Container sx={{ maxWidth:'100%'  }} maxWidth={false} >
          <Grid container spacing={3}>
            <Grid item container spacing={3} md={12} lg={8}>
              <Grid item xs={12} md={12}>
                <FormulaEditor />
              </Grid>
              <Grid item xs={12} md={12}>
                <ControlPanel />
              </Grid>
              <AlgorithmSteps />
            </Grid>
            <Grid item md={0} lg={4}>
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
