import './App.css';
import { Theme, useTheme } from '@mui/material';
import ControlPanel from './components/ControlPanel';
import { AppBar, Toolbar, Typography, Container, Grid, Box, Drawer, List, ListItemButton, ListItemText, CardContent, Card } from '@mui/material';
import FormulaEditor from './components/formula/FormulaEditor';
import AlgorithmSteps from './components/algorithm/AlgorithmSteps';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import MuiListItem from "@material-ui/core/ListItem";
import { withStyles } from "@material-ui/core/styles";

const ListItem = withStyles({
  root: {
    padding: 0,
    "&$selected": {
      backgroundColor: "#2E2E2E",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white"
      },
      "& .MuiIconButton-root": {
        color: "white"
      }
    },
    "&$selected:hover": {
      backgroundColor: "#2E2E2E",
    },
    "&:hover": {
      backgroundColor: "#00000000",
    }
  },
  selected: {}
})(MuiListItem);


function App() {
  const theme: Theme = useTheme();

  const workspaces: string[] = new Array(20).fill("workspace");
  const drawerWidth = 140;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Proofster
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={true}
        sx={{ width: drawerWidth }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {workspaces.map((text, index) => (
              <ListItem
                button
                selected={index === 2}
                onClick={() => { }}
              >
                <ListItemButton>
                  <Grid container spacing={2} alignItems="center"
                    sx={{ padding: "5px" }}
                  >
                    <Grid item xs={12} md={3}>
                      <LibraryBooksOutlinedIcon />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ListItemText primary={text} />
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Container sx={{ maxWidth:'100%'  }} maxWidth={false} >
          <Grid container spacing={3} md={12}>
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
