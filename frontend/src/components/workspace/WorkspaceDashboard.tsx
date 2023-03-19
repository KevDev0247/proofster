import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Theme, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { Typography, Grid, Box, CardContent, Card } from '@mui/material';
import { Pagination } from '@mui/material';
import { getMetadataListCall } from '../../network/algorithmApi';
import { IMetadata } from '../../models/metadata';
import { IWorkspace } from '../../models/workspace';


export default function WorkspaceDashboard() {
  const theme: Theme = useTheme();

  const dispatch: AppDispatch = useAppDispatch();

  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );
  const metadataList: IMetadata[] = useSelector(
    (state: RootState) => state.algorithm.metadata.list
  );

  useEffect(() => {
    dispatch(getMetadataListCall({}));
  }, []);

  const [metadataDisplay, setMetadataDisplay] = useState<IMetadata[]>([]);
  useEffect(() => {
    const metadataDisplay = metadataList.map((m) => {
      const matchingRecord = workspaceList.find((w) => w.id === m.workspace_id);
      return {
        ...m,
        workspace_name: matchingRecord?.name || "",
      }
    });

    workspaceList.forEach((w) => {
      const matchingRecord = metadataList.find((m) => m.workspace_id === w.id);
      if (!matchingRecord) {
        metadataDisplay.push({
          workspace_id: w.id,
          workspace_name: w.name,
          is_empty: true,
          is_transpiled: false,
          all_normalized: false,
          is_preprocessed: false
        })
      }
    });
    metadataDisplay.sort((a, b) => {
      if (!a.is_transpiled && !a.is_empty) {
        return -1;
      } else if (a.all_normalized && a.is_preprocessed) {
        return -1;
      } else {
        return 1;
      }
    });
    setMetadataDisplay(metadataDisplay);
  }, [workspaceList, metadataList]);


  const itemsPerPage = 7;
  const [page, setPage] = useState(1);
  const handleNextPage = (e: ChangeEvent<unknown>, value: number): void => {
    setPage(value)
  }

  return (
    <Card
      sx={{ boxShadow: 3 }}
    >
      <Box sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 2,
        pl: 2,
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" component="h1">
              Dashboard
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <CardContent>
        <Grid container spacing={1}>
          {metadataDisplay
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((d: IMetadata, index: number) => (
              <Grid item xs={12} md={12} lg={12} key={index}>
                <Alert severity={
                  (d.all_normalized && d.is_preprocessed) ? "success" :
                    (d.all_normalized) ? "warning" :
                      (d.is_preprocessed) ? "warning" :
                        (d.is_transpiled) ? "warning" :
                          (!d.is_transpiled && !d.is_empty) ? "error" :
                            "info"
                }>
                  <AlertTitle><strong>{d.workspace_name}</strong></AlertTitle>
                  {(d.all_normalized && d.is_preprocessed) ?
                    "Fully preprocessed and normalized" :
                    (d.all_normalized) ?
                      ((<>Fully normalized but <strong>not preprocessed</strong></>)) :
                      (d.is_preprocessed) ?
                        (<>Fully preprocessed but <strong>not normalized</strong></>) :
                        (d.is_transpiled) ?
                          "Not normalized or preprocessed" :
                          (!d.is_transpiled && !d.is_empty) ?
                            "Not transpiled" :
                            "Workspace is empty"
                  }
                </Alert>
              </Grid>
            ))}
        </Grid>
        <Stack spacing={2} sx={{ marginTop: '1rem' }}>
          <Pagination
            count={Math.ceil(metadataDisplay.length / itemsPerPage)}
            page={page}
            onChange={(event, value) => handleNextPage(event, value)}
            variant="outlined"
            color="primary"
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
