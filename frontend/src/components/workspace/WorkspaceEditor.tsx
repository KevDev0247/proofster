import { useEffect, useState } from 'react';
import { Grid, Box, Typography, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function WorkspaceEditor() {

  const [createStatus, setCreateStatus] = useState("");

  const handleCreate = () => {

  }

  const handleConfirm = () => {

  }

  return (
    <>
      <Box sx={{
        paddingLeft: 2,
        paddingRight: 1,
        paddingTop: 1,
        paddingBottom: 1,
        width: 50
      }}>
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
      <Box sx={{
        paddingLeft: 2,
        paddingRight: 1,
        paddingBottom: 1
      }}>
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
      <Box sx={{
        paddingLeft: 2,
        paddingRight: 1,
        paddingBottom: 1
      }}>
        <Button variant="outlined">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={8} md={8} container>
              <CloseIcon />
            </Grid>
            <Grid item xs={4} md={4} container justifyContent="flex-end">
              <Typography variant="body2">Cancel</Typography>
            </Grid>
          </Grid>
        </Button>
      </Box>
    </>
  )
}
