import { useEffect } from 'react'
import { Alert, Grid } from '@mui/material';
import { setError } from '../../slices/algorithmSlice';
import { setShowCacheWarning, setShowError } from '../../slices/globalSlice';
import { AppDispatch, RootState, useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { formulaUpdatedWarning } from '../../constants';


export default function AlgorithmAlerts() {
  const dispatch: AppDispatch = useAppDispatch();

  const error: string = useSelector(
    (state: RootState) => state.algorithm.normalize.error
  );
  const showError: boolean = useSelector(
    (state: RootState) => state.global.showError
  );  
  const showCacheWarning: boolean = useSelector(
    (state: RootState) => state.global.showCacheWarning
  );
  
  useEffect(() => {
    if (error.length != 0)
      dispatch(setShowError(true));
    else
      dispatch(setShowError(false));
  }, [error]);

  const handleCloseError = (): void => {
    dispatch(setShowError(false));
    dispatch(setError(""));
  };

  const handleCloseWarning = (): void => {
    dispatch(setShowCacheWarning(false));
  };
  
  return (
    <>
      {showError && (
        <Grid item container xs={12} md={12} justifyContent="center">
          <Alert
            onClose={handleCloseError}
            severity="error"
          >
            {error}
          </Alert>
        </Grid>
      )}
      {showCacheWarning && (
        <Grid item container xs={12} md={12} justifyContent="center">
          <Alert
            onClose={handleCloseWarning}
            severity="warning"
          >
            {formulaUpdatedWarning}
          </Alert>
        </Grid>
      )}
    </>
  )
}
