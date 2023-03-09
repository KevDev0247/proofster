import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch, useAppDispatch } from '../store';
import { 
  Grid, Card, Box, CardContent, Typography, SelectChangeEvent, 
  FormControl, Select, InputLabel, MenuItem, FormHelperText, Alert 
} from '@mui/material';
import { Theme, useTheme } from '@mui/material';
import FormulaDisplay from './formula/FormulaDisplay';
import AlgorithmControl from './algorithm/AlgorithmControl';
import AlgorithmAlerts from './algorithm/AlgorithmAlerts';
import { 
  clearCache, setStopStage, 
  setShowValidation, 
  setSelectedStage,
  resetStage
} from '../slices/algorithmSlice';
import {
  prompt, nnfSubtitle, pnfSubtitle,
  cnfSubtitle, preprocessSubtitle
} from '../constants';


interface Option {
  label: string;
  value: string;
}
const options: Option[] = [
  { label: 'Normalize to Negation Normal Form', value: '3' },
  { label: 'Normalize to Prenex Normal Form', value: '6' },
  { label: 'Normalize to Conjunctive Normal Form', value: '8' },
  { label: 'Resolution Proof Preprocessing', value: '9' },
];


export default function ControlPanel() {
  const dispatch: AppDispatch = useAppDispatch();
  const theme: Theme = useTheme();

  const showValidation: boolean = useSelector(
    (state: RootState) => state.algorithm.normalize.showValidation
  );
  const selectedStage: string = useSelector(
    (state: RootState) => state.algorithm.normalize.selectedStage
  );
  useEffect(() => {
    if (selectedStage != '')
      dispatch(setShowValidation(false));
  }, [selectedStage]);

  const handleOptionChange = (event: SelectChangeEvent): void => {
    dispatch(resetStage());
    dispatch(setSelectedStage(event.target.value));
    dispatch(setStopStage(parseInt(event.target.value)));
  };

  return (
    <Card
      sx={{ boxShadow: 3 }}
    >
      <Box sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: 'white', 
        py: 2, 
        pl: 2 
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" component="h1">
              Control Panel
            </Typography>            
          </Grid>
        </Grid>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          <FormulaDisplay />
          <AlgorithmAlerts />

          <Grid item xs={12} md={5}>
            <FormControl fullWidth error={showValidation}>
              <InputLabel id="algorithm-select">Algorithm</InputLabel>
              <Select
                labelId="algorithm-select"
                id="algorithm-select"
                value={selectedStage}
                onChange={handleOptionChange}
                label="Algorithm"
              >
                {options.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {showValidation && (
                <FormHelperText>
                  Please select an algorithm
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={7} container alignItems="center">
            <Grid item xs={12} md={12} alignItems="flex-end">
              <Alert severity="info">
                {(() => {
                  switch (selectedStage) {
                    case '3':
                      return nnfSubtitle
                    case '6':
                      return pnfSubtitle
                    case '8':
                      return cnfSubtitle
                    case '9':
                      return preprocessSubtitle
                    default:
                      return prompt
                  }
                })()}
              </Alert>
            </Grid>
          </Grid>

          <AlgorithmControl isInitialStep={true} />
        </Grid>
      </CardContent>
    </Card>
  )
}
