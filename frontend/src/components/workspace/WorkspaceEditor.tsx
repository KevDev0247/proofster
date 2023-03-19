import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { Grid, Box, Typography, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IWorkspace } from '../../models/workspace';
import {
  setSelected,
  setShowValidation,
  setFormOpened
} from '../../slices/workspaceSlice';
import { WorkspaceService } from './../../services/WorkspaceService';
import { setIsDashboardPage } from '../../slices/globalSlice';


export default function WorkspaceEditor(
  props: {
    isSmDown: boolean,
    isMdDown: boolean
  }
) {
  const { isSmDown, isMdDown } = props;

  const dispatch: AppDispatch = useAppDispatch();

  const selected: IWorkspace = useSelector(
    (state: RootState) => state.workspace.save.selected
  );
  const showValidation: boolean = useSelector(
    (state: RootState) => state.workspace.save.showValidation
  );
  const formOpened: boolean = useSelector(
    (state: RootState) => state.workspace.save.formOpened
  );

  const isDashboardPage: boolean = useSelector(
    (state: RootState) => state.global.isDashboardPage
  );
  const currentUserId: number = useSelector(
    (state: RootState) => state.global.currentUserId
  );
  useEffect(() => {
    dispatch(
      setSelected({
        ...selected,
        user_id: currentUserId,
      })
    );
  }, [currentUserId]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    dispatch(
      setSelected({
        ...selected,
        [name]: value,
      })
    );
  }

  const switchPage = (): void => {
    dispatch(setIsDashboardPage(!isDashboardPage));
  }

  const openForm = (): void => {
    dispatch(setFormOpened(true));
  }

  const closeForm = (): void => {
    dispatch(setFormOpened(false));
    dispatch(
      WorkspaceService().resetCache()
    );
  }

  const submit = (
    e: React.SyntheticEvent
  ): void => {
    e.preventDefault();

    if (selected.name === "") {
      dispatch(setShowValidation(true));
      return;
    }
    var workspaceToSubmit: IWorkspace = {
      ...selected,
      user_id: currentUserId,
    }

    dispatch(
      WorkspaceService().createOrUpdateWorkspace(workspaceToSubmit)
    )
  }

  return (
    <Box sx={{ paddingTop: 1 }}>
      <Box sx={{
        paddingLeft: 2,
        paddingRight: 1,
        paddingTop: 0,
        paddingBottom: 2,
      }}>
        <Button
          variant="outlined"
          onClick={switchPage}
          sx={{ height: isSmDown ? 66 : 46, width: 153 }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={8} md={8} container>
              {isDashboardPage ? (
                <ArrowBackIcon />
              ) : (
                <BarChartIcon />
              )}
            </Grid>
            <Grid item xs={4} md={4}
              container
              justifyContent="flex-end"
            >
              <Typography variant="body2">
                {isDashboardPage ? "Back" : "Stats"}
              </Typography>
            </Grid>
          </Grid>
        </Button>
      </Box>
      {formOpened && (
        <Box sx={{
          paddingLeft: 2,
          paddingRight: 1,
          paddingTop: 0,
          paddingBottom: 2,
          width: 50
        }}>
          <TextField
            id="name"
            name="name"
            label="Workspace"
            variant="outlined"
            type="text"
            value={selected.name}
            onChange={handleInputChange}
            placeholder="Enter Name"
            fullWidth
            error={showValidation}
            helperText={showValidation && 'Name is required'}
            sx={{ width: '305%' }}
          />
        </Box>
      )}
      <Box sx={{
        paddingLeft: 2,
        paddingRight: 1,
        paddingBottom: 2
      }}>
        <Button
          variant="outlined"
          onClick={formOpened ? submit : openForm}
          sx={{ height: isSmDown ? 66 : 46, width: 153 }}
        >
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={8} md={8} container>
              <AddIcon />
            </Grid>
            <Grid item xs={4} md={4}
              container
              justifyContent="flex-end"
            >
              <Typography variant="body2">
                {formOpened ? "Submit" : "Create"}
              </Typography>
            </Grid>
          </Grid>
        </Button>
      </Box>
      {formOpened && (
        <Box sx={{
          paddingLeft: 2,
          paddingRight: 1,
          paddingBottom: 2
        }}>
          <Button
            variant="outlined"
            onClick={closeForm}
            sx={{ height: isSmDown ? 66 : 46, width: 153 }}
          >
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={8} md={8}
                container
              >
                <CloseIcon />
              </Grid>
              <Grid item xs={4} md={4}
                container
                justifyContent="flex-end"
              >
                <Typography variant="body2">Cancel</Typography>
              </Grid>
            </Grid>
          </Button>
        </Box>
      )}
    </Box>
  )
}
