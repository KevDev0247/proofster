import './App.css';
import { IconButton, Theme, useMediaQuery, useTheme } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import {
  AppBar, Toolbar, Typography, Container, Grid, Box
} from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from './store';

import FormulaEditor from './components/formula/FormulaEditor';
import AlgorithmSteps from './components/algorithm/AlgorithmSteps';
import WorkspacesDrawer from './components/workspace/WorkspacesDrawer';
import WorkspaceDisplay from './components/workspace/WorkspaceDisplay';
import { setDrawerOpened } from './slices/globalSlice';
import WorkspaceDashboard from './components/workspace/WorkspaceDashboard';
import Instructions from './components/Instructions';


function App() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();
  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Grid container>
            <Grid item xs={2} lg={4}
              container
              alignItems="center"
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              {!isSmDown && (
                <Typography variant="h6">
                  Proofster
                </Typography>
              )}
            </Grid>

            <WorkspaceDisplay />

            <Grid item xs={4} lg={4}></Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <WorkspacesDrawer isSmDown={isSmDown} />

      <Box sx={{
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 0,
        paddingRight: 0
      }}>
        <Toolbar />
        <Container sx={{ maxWidth: '100%' }} maxWidth={false} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={8}>
              <FormulaEditor isSmDown={isSmDown} />
            </Grid>
            {!isSmDown && (
              <Grid item md={4} lg={4}>
                <Instructions />
              </Grid>
            )}
            <Grid item container spacing={3} md={8} lg={8}>
              <Grid item xs={12} md={12}>
                <ControlPanel isSmDown={isSmDown} />
              </Grid>
              <AlgorithmSteps isSmDown={isSmDown} />
            </Grid>
            <Grid item md={4} lg={4}>
              <WorkspaceDashboard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
