import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { Typography, Grid } from '@mui/material';
import Edit from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { IWorkspace } from '../../models/workspace';
import { setFormOpened, setSelected, setShowValidation } from '../../slices/workspaceSlice';
import { WorkspaceService } from '../../services/WorkspaceService';


export default function WorkspaceDisplay() {
  const dispatch: AppDispatch = useAppDispatch();
  
  const currentWorkspace: IWorkspace = useSelector(
    (state: RootState) => state.global.currentWorkspace
  );

  const selectWorkspace = (d: IWorkspace): void => {
    dispatch(setShowValidation(false));
    dispatch(setSelected({
      id: d.id,
      name: d.name,
      user_id: d.user_id
    }));
    dispatch(setFormOpened(true));
  }

  const removeWorkspace = (d: IWorkspace): void => {
    if (d.id)
      dispatch(
        WorkspaceService().deleteWorkspace({
          userId: d.user_id,
          workspaceId: d.id,
        })
      )
  }

  return (
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
        {currentWorkspace.name}
      </Typography>
      <IconButton
        onClick={() => selectWorkspace(currentWorkspace)}
        disabled={false}
        sx={{ color: 'white' }}
      >
        <Edit />
      </IconButton>
      <IconButton
        onClick={() => removeWorkspace(currentWorkspace)}
        disabled={false}
        sx={{ color: 'white' }}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Grid>
  )
}
