import './App.css';
import { IconButton, Theme, useMediaQuery, useTheme } from '@mui/material';
import { AppBar, Toolbar, Typography, Container, Grid, Box } from '@mui/material';
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from './store';

import { setDrawerOpened } from './slices/globalSlice';
import FormulaEditor from './components/formula/FormulaEditor';
import AlgorithmSteps from './components/algorithm/AlgorithmSteps';
import WorkspacesDrawer from './components/workspace/WorkspacesDrawer';
import WorkspaceDisplay from './components/workspace/WorkspaceDisplay';
import WorkspaceDashboard from './components/workspace/WorkspaceDashboard';
import ControlPanel from './components/ControlPanel';
import WorkspaceStats from './components/workspace/WorkspaceChart';

function App() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const isMdDown: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const isSmDown: boolean = useMediaQuery(theme.breakpoints.down('sm'));

  const isDashboardPage: boolean = useSelector(
    (state: RootState) => state.global.isDashboardPage
  );
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
              {isSmDown && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={toggleDrawer}
                >
                  <MenuIcon />
                </IconButton>                
              )}
              {!isSmDown && (
                <Typography variant="h6">
                  Proofster
                </Typography>
              )}
            </Grid>

            {!isDashboardPage ? (
              <WorkspaceDisplay />
            ) : (
              <Grid item xs={10} lg={4}
                container
                spacing={3}
                justifyContent="center"
                alignItems="center"
                sx={{ marginTop: 0 }}
              >
                <Typography variant="h6"
                  sx={{ marginRight: 2 }}
                >
                  Statistics
                </Typography>
              </Grid>
            )}

            <Grid item xs={4} lg={4}></Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <WorkspacesDrawer
        isSmDown={isSmDown}
        isMdDown={isMdDown}
      />

      <Box sx={{
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 0,
        paddingRight: 0
      }}>
        <Toolbar />
        <Container sx={{ maxWidth: '100%' }} maxWidth={false} >
          {isDashboardPage ? (
            <Grid container spacing={3}>
              <Grid item xs={11.8} sm={11.8} lg={6}>
                <WorkspaceDashboard />
              </Grid>
              <Grid item xs={11.8} sm={11.8} lg={6}>
                <WorkspaceStats />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item container spacing={3} sm={12} md={8} lg={8}>
                <Grid item container spacing={4}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormulaEditor isSmDown={isSmDown} />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <ControlPanel isSmDown={isSmDown} />
                  </Grid>
                </Grid>

                <AlgorithmSteps isSmDown={isSmDown} />
              </Grid>
              {!isMdDown && (
                <Grid item md={3.3} lg={3.4} className="workspace-dashboard">
                  <WorkspaceDashboard />
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default App;
