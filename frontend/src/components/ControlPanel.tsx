import React, { useState } from 'react'
import { Grid, Card, Box, CardContent, Typography } from '@mui/material';
import FormulaTable from './../features/Formula/FormulaTable';
import FormulaEditor from './../features/Formula/FormulaEditor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Button, CircularProgress } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Option {
  label: string;
  value: string;
}

export default function ControlPanel() {
  const [selectedOption, setSelectedOption] = useState('');

  const options: Option[] = [
    { label: 'Normalize to Negation Normal Form', value: 'nnf' },
    { label: 'Normalize to Prenex Normal Form', value: 'pnf' },
    { label: 'Normalize to Conjunctive Normal Form', value: 'cnf' },
  ];

  const handleOptionChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <FormulaEditor />
      </Grid>
      <Grid item xs={12} md={12}>
        <Card
          sx={{ boxShadow: 3 }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography variant="h5" component="h1" gutterBottom>
                  Control Panel
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormulaTable />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="algorithm-select">Algorithm</InputLabel>
                    <Select
                      labelId="algorithm-select"
                      id="algorithm-select"
                      value={selectedOption}
                      onChange={handleOptionChange}
                      label="Algorithm"
                    >
                      {options.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} container justifyContent="flex-end">
                <Typography variant="caption" component="h1" gutterBottom>
                  In Boolean logic, a formula is in conjunctive normal form (CNF) if it is a conjunction of one or more clauses, where a clause is a disjunction of literals; otherwise put, it is a product of sums or an AND of ORs.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { }}
                  disabled={false}
                  startIcon={false && <CircularProgress size={20} />}
                >
                  Execute
                </Button>
              </Grid>
              <Grid item xs={12} md={6} container justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => { }}
                  disabled={false}
                  startIcon={false && <CircularProgress size={20} />}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
