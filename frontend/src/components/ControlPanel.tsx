import React, { useState } from 'react'
import { Grid, Card, Box, CardContent, Typography, Select } from '@material-ui/core';
import FormulaTable from './../features/Formula/FormulaTable';
import FormulaEditor from './../features/Formula/FormulaEditor';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from './Button';

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

  const handleOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={12}>
        <FormulaEditor />
      </Grid>
      <Grid item xs={12} md={12}>
        <Card>
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="demo-simple-select">Algorithm</InputLabel>
                    <Select
                      id="demo-simple-select"
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
                  type="contained"
                  loading={false}
                  title="Execute"
                  color="primary"
                  onClick={() => {}}
                  disabled={false}
                />
              </Grid>
              <Grid item xs={12} md={6} container justifyContent="flex-end">
                <Button
                  type="outlined"
                  loading={false}
                  title="Reset"
                  color="primary"
                  onClick={() => {}}
                  disabled={false}
                />
              </Grid>              
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
