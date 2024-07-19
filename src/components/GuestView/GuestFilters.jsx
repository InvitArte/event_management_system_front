import React, { useState, useEffect } from 'react';
import { Box, Autocomplete, TextField } from '@mui/material';

const GuestFilters = ({ guests, onFilterChange }) => {
  const [filters, setFilters] = useState({});

  const uniqueMenus = [...new Set(guests.map(guest => guest.menu))];
  const uniqueAllergies = [...new Set(guests.map(guest => guest.allergy))];

  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (value === null || value === '') {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      return newFilters;
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <Autocomplete
        options={uniqueMenus}
        renderInput={(params) => <TextField {...params} label="Filtrar por Menú" />}
        onChange={(event, value) => handleFilterChange('menu', value)}
        sx={{ width: 300 }}
      />
      <Autocomplete
        options={uniqueAllergies}
        renderInput={(params) => <TextField {...params} label="Filtrar por Alergia" />}
        onChange={(event, value) => handleFilterChange('allergy', value)}
        sx={{ width: 300 }}
      />
      <Autocomplete
        options={['Sí', 'No']}
        renderInput={(params) => <TextField {...params} label="Necesita Hotel" />}
        onChange={(event, value) => handleFilterChange('needs_hotel', value)}
        sx={{ width:200 }}
      />
      <Autocomplete
        options={['Sí', 'No']}
        renderInput={(params) => <TextField {...params} label="Necesita Transporte" />}
        onChange={(event, value) => handleFilterChange('needs_transport', value)}
        sx={{ width: 200 }}
      />
      <Autocomplete
       options={['Sí', 'No']}
       renderInput={(params) => <TextField {...params} label="Verificado" />}
       onChange = {(event, value) => handleFilterChange('validated', value)}
       sx={{ width: 200 }}
       />
    </Box>
  );
};

export default GuestFilters;