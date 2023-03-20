import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Stack, Theme, useTheme, IconButton } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { Typography, Grid, Box, CardContent, Card } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { Pagination } from '@mui/material';
import { getMetadataListCall } from '../../network/algorithmApi';
import { IMetadata } from '../../models/metadata';
import { IWorkspace } from '../../models/workspace';
import { MetadataService } from './../../services/MetadataService';
import { setCurrentWorkspace, setIsDashboardPage } from '../../slices/globalSlice';
import { resetStage } from '../../slices/algorithmSlice';


export default function WorkspaceDashboard() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const [showFourItems, setShowFourItems] = useState(window.innerHeight < 850);
  const [showTwoItems, setShowTwoItems] = useState(window.innerHeight < 590);


  useEffect(() => {
    dispatch(getMetadataListCall({}));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowFourItems(window.innerHeight < 850);
      setShowTwoItems(window.innerHeight < 590);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const workspaceList: IWorkspace[] = useSelector(
    (state: RootState) => state.workspace.list.values
  );
  const metadataList: IMetadata[] = useSelector(
    (state: RootState) => state.algorithm.metadata.list
  );
  const [aggregatedMetadata, setAggregatedMetadata] = useState<IMetadata[]>([]);
  useEffect(() => {
    setAggregatedMetadata(
      MetadataService().aggregateData(
        metadataList, workspaceList
      )
    );
  }, [workspaceList, metadataList]);


  const goToWorkspace = (workspaceId: string): void => {
    dispatch(resetStage());
    dispatch(setIsDashboardPage(false));
    dispatch(
      setCurrentWorkspace(
        workspaceList.find(
          workspace => workspace.id === workspaceId
        ) || workspaceList[0]
      )
    );
  }

  const itemsPerPage =
    showTwoItems ? 2 :
      showFourItems ? 4 : 7;
  const [page, setPage] = useState(1);

  const nextPage = (e: ChangeEvent<unknown>, value: number): void => {
    setPage(value)
  }

  const refresh = (): void => {
    dispatch(getMetadataListCall({}));
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
          <Grid item xs={4} md={4}>
            <Typography variant="h6" component="h1">
              Dashboard
            </Typography>
          </Grid>
          <Grid item xs={8} md={8} container justifyContent="flex-end">
            <IconButton
              onClick={refresh}
              disabled={false}
              sx={{ color: 'white', marginRight: 2 }}
            >
              <CachedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <CardContent>
        <Grid container spacing={1}>
          {aggregatedMetadata
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((d: IMetadata, index: number) => (
              <Grid item xs={12} md={12} lg={12} key={index}>
                <Alert
                  severity={
                    (d.all_normalized && d.is_preprocessed) ? "success" :
                      (d.all_normalized) ? "warning" :
                        (d.is_preprocessed) ? "warning" :
                          (d.is_transpiled) ? "warning" :
                            (!d.is_transpiled && !d.is_empty) ? "error" :
                              "info"
                  }
                  onClick={() => goToWorkspace(d.workspace_id)}
                >
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
            count={Math.ceil(aggregatedMetadata.length / itemsPerPage)}
            page={page}
            onChange={(event, value) => nextPage(event, value)}
            variant="outlined"
            color="primary"
          />
        </Stack>
      </CardContent>
    </Card>
  )
}
