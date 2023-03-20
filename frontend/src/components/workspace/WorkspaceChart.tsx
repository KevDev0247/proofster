import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { IconButton, Theme, useTheme } from '@mui/material';
import { Typography, Grid, Box, CardContent, Card } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { getMetadataListCall } from '../../network/algorithmApi';
import { IWorkspace } from '../../models/workspace';
import { IMetadata } from '../../models/metadata';
import { MetadataService } from '../../services/MetadataService';


function WorkspaceChart() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<Chart | null>(null);


  const [heightIsMdDown, setHeightIsMdDown] = useState(window.innerHeight < 850);
  const [heightIsSmDown, setHeightIsSmDown] = useState(window.innerHeight < 590);

  useEffect(() => {
    const handleResize = () => {
      setHeightIsMdDown(window.innerHeight < 850);
      setHeightIsSmDown(window.innerHeight < 590);
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
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    setChartData(
      MetadataService().aggregateData(metadataList, workspaceList)
        .reduce((acc, metadata) => {
          var doneCount = 0;
          var incompleteCount = 0;
          var transpiledCount = 0;
          var emptyCount = 0;

          if (metadata.all_normalized && metadata.is_preprocessed) {
            doneCount += 1;
          } else if (metadata.all_normalized || metadata.is_preprocessed) {
            incompleteCount += 1;
          } else if (!metadata.is_transpiled && !metadata.is_empty) {
            transpiledCount += 1;
          } else {
            emptyCount += 1
          }

          acc[0] += doneCount;
          acc[1] += incompleteCount;
          acc[2] += transpiledCount;
          acc[3] += emptyCount;

          return acc;
        }, [0, 0, 0, 0])
    );
    initChart();
  }, [workspaceList, metadataList]);


  function initChart() {
    if (chartRef.current) {
      const myChartRef = chartRef.current?.getContext('2d');

      if (myChartRef) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(myChartRef, {
          type: 'bar',
          data: {
            labels: ['Done', 'Incomplete', 'Not Transpiled', 'Empty'],
            datasets: [
              {
                label: 'Workspace Status',
                data: chartData,
                backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(238, 238, 238, 255)',
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(46, 46, 46, 255)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          },
        });
      }
    }
  }

  const refresh = (): void => {
    dispatch(getMetadataListCall({}));
  }

  return (
    <Card sx={{ boxShadow: 3 }}>
      <Box sx={{
        bgcolor: theme.palette.primary.main,
        color: 'white',
        py: 2,
        pl: 2,
      }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={6}>
            <Typography variant="h6" component="h1">
              Status Chart
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6}
            container
            justifyContent="flex-end"
          >
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
        <Grid container spacing={1} justifyContent="center">
          <canvas
            ref={chartRef}
            style={{
              position: "relative",
              height:
                heightIsMdDown ? "37vh" :
                  heightIsSmDown ? "110vh" : "26vh",
              width: "930vw"
            }}
          />
        </Grid>
      </CardContent>
    </Card>
  );
}

export default WorkspaceChart;
