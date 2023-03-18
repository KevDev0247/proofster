import { IconButton } from '@mui/material';
import { Typography, Grid } from '@mui/material';
import Edit from '@material-ui/icons/Edit';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

export default function WorkspaceDisplay() {

  return (
    <Grid item xs={6} lg={4}
      container
      spacing={3}
      justifyContent="center"
      alignItems="center"
      sx={{ marginTop: 0 }}
    >
      <Typography variant="h6"
        sx={{ marginRight: 2 }}
      >
        Workspace
      </Typography>
      <IconButton
        onClick={() => { }}
        disabled={false}
        sx={{ color: 'white' }}
      >
        <Edit />
      </IconButton>
      <IconButton
        onClick={() => { }}
        disabled={false}
        sx={{ color: 'white' }}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Grid>
  )
}
