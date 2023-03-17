import { useEffect } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List,
  ListItemButton, ListItemText, ButtonBase, Typography, Button, TextField
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AddIcon from '@mui/icons-material/Add';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';
import { setSelectedWorkspaceId } from '../../slices/globalSlice';


export default function WorkspacesDrawer() {
  const dispatch: AppDispatch = useAppDispatch();

  const selectedWorkspaceId: string = useSelector(
    (state: RootState) => state.global.selectedWorkspaceId
  );
  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );

  const handleWorkspaceSelection = (workspaceId: string) => {
    dispatch(
      setSelectedWorkspaceId(workspaceId)
    );
  }

  useEffect(() => {
    dispatch(getWorkspacesCall(1));
  }, []);

  return (
    <Drawer
      variant="persistent"
      open={true}
      sx={{ width: 180 }}
    >
      <Toolbar />
      <Box>
        <List>
          <Box sx={{ paddingLeft: 2, paddingRight: 1, paddingTop: 1, paddingBottom: 1, width: 50 }}>
            <TextField
              id="id"
              name="name"
              label="Workspace"
              variant="outlined"
              type="text"
              value={""}
              onChange={() => { }}
              placeholder="Enter Name"
              fullWidth
              error={false}
              helperText={false && 'Formula is required'}
              sx={{ width: '305%' }}
            />
          </Box>
          <Box sx={{ paddingLeft: 2, paddingRight: 1, paddingTop: 1, paddingBottom: 1 }}>
            <Button variant="outlined">
              <Grid container spacing={5} alignItems="center">
                <Grid item xs={8} md={8} container>
                  <AddIcon />
                </Grid>
                <Grid item xs={4} md={4} container justifyContent="flex-end">
                  <Typography variant="body2">Create</Typography>
                </Grid>
              </Grid>
            </Button>
          </Box>

          {workspaceList.map((d: IWorkspace, index: number) => (
            <ListItemButton
              selected={d.id === selectedWorkspaceId}
              sx={{ padding: 0 }}
            >
              <ButtonBase onClick={() => handleWorkspaceSelection(d.id)}>
                <Grid container spacing={2} alignItems="center"
                  sx={{ paddingY: 1, paddingX: 3 }}
                >
                  <Grid item xs={12} md={3}>
                    <LibraryBooksOutlinedIcon />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <ListItemText primary={d.name} />
                  </Grid>
                </Grid>
              </ButtonBase>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
