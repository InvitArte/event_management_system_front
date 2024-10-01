import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Grid, Typography } from "@mui/material";
import { normalizeText } from "../../../components/Utils/TextUtils";

const ContactFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({});
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (value === null || value === "") {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    const normalizedFilters = { ...filters };
    if (normalizedFilters.name) {
      normalizedFilters.name = normalizeText(normalizedFilters.name);
    }
    onFilterChange(normalizedFilters);
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
    setClearTrigger(prev => prev + 1);
  }, [onFilterChange]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h4">Filtros</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por nombre"
            onChange={(e) => handleFilterChange("name", e.target.value)}
            value={filters.name || ""}
            key={`name-${clearTrigger}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por email"
            onChange={(e) => handleFilterChange("email", e.target.value)}
            value={filters.email || ""}
            key={`email-${clearTrigger}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Buscar por teléfono"
            onChange={(e) => handleFilterChange("phone", e.target.value)}
            value={filters.phone || ""}
            key={`phone-${clearTrigger}`}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant={hasActiveFilters ? "contained" : "outlined"}
            color={hasActiveFilters ? "secondary" : "primary"}
            onClick={handleClearFilters}
            fullWidth
          >
            Limpiar filtros
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

ContactFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default ContactFilters;
