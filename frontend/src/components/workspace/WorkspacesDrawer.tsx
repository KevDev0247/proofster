import { useEffect } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List, ListItemButton, ListItemText, ButtonBase,
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';
import { setSelectedWorkspaceId } from '../../slices/globalSlice';
import WorkspaceEditor from './WorkspaceEditor';


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
          <WorkspaceEditor />

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
