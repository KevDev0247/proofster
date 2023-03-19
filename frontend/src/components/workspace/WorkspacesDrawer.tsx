import { useEffect, useState } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List, ListItemButton, ListItemText, ButtonBase
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';
import { 
  setDrawerOpened, 
  setCurrentWorkspace
} from '../../slices/globalSlice';
import WorkspaceEditor from './WorkspaceEditor';


export default function WorkspacesDrawer(
  props: { isSmDown: boolean }
) {
  const { isSmDown } = props;  

  const dispatch: AppDispatch = useAppDispatch();

  const currentWorkspace: IWorkspace = useSelector(
    (state: RootState) => state.global.currentWorkspace
  );
  const drawerOpened: boolean = useSelector(
    (state: RootState) => state.global.drawerOpened
  );

  useEffect(() => {
    dispatch(getWorkspacesCall(1));
  }, []);

  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );  
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  useEffect(() => {
    if (selectedIndex !== -1) 
      dispatch(
        setCurrentWorkspace(workspaceList[selectedIndex])
      );
    else
      if (workspaceList.length !== 0)
        dispatch(
          setCurrentWorkspace(workspaceList[0])
        );
  }, [selectedIndex, workspaceList]);

  useEffect(() => {
    if (isSmDown)
      dispatch(setDrawerOpened(false));
    else
      dispatch(setDrawerOpened(true));
  }, [isSmDown]);


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
          <WorkspaceEditor key={0} isSmDown={isSmDown} />

          {workspaceList.map((d: IWorkspace, index: number) => (
            <ListItemButton
              key={d.id}
              selected={d.id === currentWorkspace.id}
              sx={{ padding: 0 }}
            >
              <ButtonBase onClick={() => setSelectedIndex(index)}>
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
