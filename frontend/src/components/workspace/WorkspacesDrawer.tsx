import { useEffect, useState } from 'react';
import {
  Toolbar, Grid, Box, Drawer, List, ListItemButton, ButtonBase, Typography
} from '@mui/material';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { getWorkspacesCall } from '../../network/workspaceApi';
import { IWorkspace } from '../../models/workspace';
import { useSelector } from 'react-redux';
import { 
  setDrawerOpened, 
  setCurrentWorkspace,
  setIsDashboardPage
} from '../../slices/globalSlice';
import WorkspaceEditor from './WorkspaceEditor';
import { resetStage } from '../../slices/algorithmSlice';


export default function WorkspacesDrawer(
  props: { 
    isSmDown: boolean,
    isMdDown: boolean
  }
) {
  const { isSmDown, isMdDown } = props;  

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
  useEffect(() => {
    if (workspaceList.length !== 0) {
      dispatch(
        setCurrentWorkspace(workspaceList.find(
          workspace => workspace.id === selected
        ) || workspaceList[0])
      );
    }
  }, [workspaceList]);

  const [selected, setSelected] = useState<string>("");
  const handleWorkspaceSelection = (id: string): void => {
    setSelected(id);
    dispatch(resetStage());
    dispatch(setIsDashboardPage(false));
    dispatch(
      setCurrentWorkspace(
        workspaceList.find(
          workspace => workspace.id === id
        ) || workspaceList[0]
      )
    );
  }

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
      variant={isSmDown ? "temporary" : "permanent"}
      sx={{ width: isSmDown ? '0%' : 200, }}
      open={drawerOpened}
      onClose={toggleDrawer}
    >
      <Toolbar />
      <Box>
        <List>
          <WorkspaceEditor 
            key={0} 
            isSmDown={isSmDown}
            isMdDown={isMdDown} 
          />

          {workspaceList.map((d: IWorkspace, index: number) => (
            <ListItemButton
              key={d.id}
              selected={d.id === currentWorkspace.id}
              sx={{ padding: 0 }}
            >
              <ButtonBase 
                onClick={() => handleWorkspaceSelection(d.id)}
                sx={{height: isSmDown ? 66 : '0%', width: "100%" }}
              >
                <Grid container spacing={2}
                  sx={{ paddingY: 1, paddingX: 3 }}
                >
                  <Grid item xs={3} md={3}>
                    <LibraryBooksOutlinedIcon />
                  </Grid>
                  <Grid item xs={9} md={9}>
                    <Typography 
                      variant="body1" 
                      sx={{ textAlign: 'left' }}
                    >
                      {d.name}
                    </Typography>
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
