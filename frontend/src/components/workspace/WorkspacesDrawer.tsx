import { useEffect } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List,
  ListItemButton, ListItemText
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';


export default function WorkspacesDrawer() {
  const dispatch: AppDispatch = useAppDispatch();

  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );

  const handleWorkspaceSelection = () => {
    
  }

  useEffect(() => {
    dispatch(getWorkspacesCall(1));
  }, []);

  return (
    <Drawer
      variant="persistent"
      open={true}
      sx={{ width: 140 }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {workspaceList.map((d: IWorkspace, index: number) => (
            <ListItemButton 
              key={d.id} 
              selected={index === 2}

            >
              <Grid container spacing={2} alignItems="center"
                sx={{ padding: "3px" }}
              >
                <Grid item xs={12} md={3}>
                  <LibraryBooksOutlinedIcon />
                </Grid>
                <Grid item xs={12} md={9}>
                  <ListItemText primary={d.name} />
                </Grid>
              </Grid>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
