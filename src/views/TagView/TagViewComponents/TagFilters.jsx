// React y hooks
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
} from "@mui/material";

// Componentes genéricos
import { FilterAutocomplete } from "../../../components";

const TagFilters = ({ tags, guests, onFilterChange, visibleFilters }) => {
  const [filters, setFilters] = useState({});
  const [clearTrigger, setClearTrigger] = useState(0);

  const uniqueValues = useMemo(() => {
    const guestNames = new Set();
    guests.forEach(guest => {
      // Solo añadimos el invitado si tiene al menos una etiqueta asignada
      if (guest.tags && guest.tags.length > 0) {
        guestNames.add(guest.fullName);
      }
    });
    return {
      guestNames: Array.from(guestNames),
    };
  }, [guests]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (value === null || (Array.isArray(value) && value.length === 0) || value === "") {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
    setClearTrigger(prev => prev + 1);
  }, [onFilterChange]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderFilter = (filterName, component) => {
    return visibleFilters[filterName] ? component : null;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" gutterBottom>Filtros de Etiquetas</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {renderFilter('tag_name',
            <TextField
              fullWidth
              label="Buscar por nombre de etiqueta"
              onChange={(e) => handleFilterChange("tag_name", e.target.value)}
              value={filters.tag_name || ""}
              key={`tag_name-${clearTrigger}`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderFilter('guest_name',
            <FilterAutocomplete
              fullWidth
              label="Filtrar por Invitado Principal"
              options={uniqueValues.guestNames}
              onChange={(_, value) => handleFilterChange("guest_name", value)}
              getOptionLabel={(option) => option || ""}
              isOptionEqualToValue={(option, value) => option === value}
              value={filters.guest_name || null}
              key={`guest_name-${clearTrigger}`}
            />
          )}
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

TagFilters.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      fullName: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  visibleFilters: PropTypes.shape({
    tag_name: PropTypes.bool,
    guest_name: PropTypes.bool,
  }).isRequired,
};

export default TagFilters;