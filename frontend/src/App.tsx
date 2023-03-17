import './App.css';
import { IconButton, Theme, useTheme } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import { 
  AppBar, Toolbar, Typography, Container, 
  Grid, Box, CardContent, Card 
} from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from './store';

import FormulaEditor from './components/formula/FormulaEditor';
import AlgorithmSteps from './components/algorithm/AlgorithmSteps';
import WorkspacesDrawer from './components/workspace/WorkspacesDrawer';
import { setDrawerOpened } from './slices/globalSlice';


function App() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const drawerOpened: boolean = useSelector(
    (state: RootState) => state.global.drawerOpened
  );  

  const toggleDrawer = (e: React.SyntheticEvent) => {
    dispatch(setDrawerOpened(!drawerOpened));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Proofster
          </Typography>
        </Toolbar>
      </AppBar>
      <WorkspacesDrawer />
      <Box sx={{ p: 3, paddingTop: 3, paddingLeft: 0 }}>
        <Toolbar />
        <Container sx={{ maxWidth:'100%' }} maxWidth={false} >
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
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
