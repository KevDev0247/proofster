import { useEffect } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List, ListItemButton, ListItemText, ButtonBase, useMediaQuery, Theme, useTheme,
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';
import { 
  setDrawerOpened, 
  setSelectedWorkspaceId 
} from '../../slices/globalSlice';
import WorkspaceEditor from './WorkspaceEditor';


export default function WorkspacesDrawer(
  props: { isSmDown: boolean }
) {
  const { isSmDown } = props;  

  const dispatch: AppDispatch = useAppDispatch();

  const selectedWorkspaceId: string = useSelector(
    (state: RootState) => state.global.selectedWorkspaceId
  );
  const drawerOpened: boolean = useSelector(
    (state: RootState) => state.global.drawerOpened
  );  
  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );
  

  useEffect(() => {
    dispatch(getWorkspacesCall(1));
  }, []);

  useEffect(() => {
    if (isSmDown)
      dispatch(setDrawerOpened(false));
    else
      dispatch(setDrawerOpened(true));
  }, [isSmDown]);


  const handleWorkspaceSelection = (workspaceId: string) => {
    dispatch(
      setSelectedWorkspaceId(workspaceId)
    );
  }

  const toggleDrawer = (e: React.SyntheticEvent) => {
    dispatch(setDrawerOpened(!drawerOpened));
  }


  return (
    <Drawer
      variant="persistent"
      sx={{ width: isSmDown ? '0%' : 190, }}
      open={drawerOpened}
      onClose={toggleDrawer}
    >
      <Toolbar />
      <Box>
        <List>
          <WorkspaceEditor isSmDown={isSmDown} />

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
