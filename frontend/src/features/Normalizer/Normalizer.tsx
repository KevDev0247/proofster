import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function Normalizer() {

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Normalizer
        </Typography>
      </CardContent>
    </Card>
  )
}
