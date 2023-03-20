import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { RootState, AppDispatch, useAppDispatch } from '../../store';
import { IconButton, Theme, useTheme } from '@mui/material';
import { Typography, Grid, Box, CardContent, Card } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { getMetadataListCall } from '../../network/algorithmApi';


function WorkspaceChart() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<Chart | null>(null);

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
            labels: ['Done', 'Incomplete', 'Transpiled', 'Empty'],
            datasets: [
              {
                label: 'Workspace Status',
                data: [1, 2, 3, 5],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
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

  useEffect(() => {
    initChart();
  }, []);

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
          <Grid item xs={4} md={4}>
            <Typography variant="h6" component="h1">
              Status Chart
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
        <canvas 
          ref={chartRef} 
          style={{ 
            position: "relative", 
            height: "26vh",
            width: "900vw" 
          }} 
        />
      </CardContent>
    </Card>
  );
}

export default WorkspaceChart;
