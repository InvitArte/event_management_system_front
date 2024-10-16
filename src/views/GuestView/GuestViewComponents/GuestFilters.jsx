// React y hooks
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Componentes genéricos
import { normalizeText, stringToColor, TagChip, FilterAutocomplete } from "../../../components";

const GuestFilters = ({ guests, onFilterChange, tags, allergies, visibleFilters }) => {
  const [filters, setFilters] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(0);

  const uniqueValues = useMemo(
    () => ({
      menus: [...new Set(guests.map((guest) => guest.menu))],
      allergies: allergies,
      accommodationPlans: [...new Set(guests.map((guest) => guest.accommodation_plan))],
      tags: Array.from(new Set(tags.map((tag) => tag.name))).map((tagName) => ({
        name: tagName,
        color: stringToColor(tagName),
      })),
    }),
    [guests, tags, allergies]
  );

  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        value === ""
      ) {
        delete newFilters[filterName];
      } else {
        newFilters[filterName] = value;
      }
      return newFilters;
    });
  }, []);

  useEffect(() => {
    const normalizedFilters = { ...filters };
    if (normalizedFilters.full_name) {
      normalizedFilters.full_name = normalizeText(normalizedFilters.full_name);
    }
    onFilterChange(normalizedFilters);
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
    setClearTrigger(prev => prev + 1); // Incrementa el clearTrigger para forzar la actualización de los componentes
  }, [onFilterChange]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderTagChips = useCallback(
    (value, getTagProps) =>
      value.map((option, index) => {
        const { key, ...chipProps } = getTagProps({ index });
        return (
          <TagChip
            key={`${option.name}-${index}`}
            tag={option}
            {...chipProps}
          />
        );
      }),
    []
  );

  const renderTagOption = useCallback((props, option) => {
    const { key, ...otherProps } = props;
    return (
      <li key={`${option.name}-${key}`} {...otherProps}>
        {option.name}
      </li>
    );
  }, []);

  const renderFilter = (filterName, component) => {
    return visibleFilters[filterName] ? component : null;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h4">Filtros</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          {renderFilter('full_name',
            <TextField
              fullWidth
              label="Buscar por nombre"
              onChange={(e) => handleFilterChange("full_name", e.target.value)}
              value={filters.full_name || ""}
              key={`full_name-${clearTrigger}`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderFilter('phone',
            <TextField
              fullWidth
              label="Buscar por teléfono"
              onChange={(e) => handleFilterChange("phone", e.target.value)}
              value={filters.phone || ""}
              key={`phone-${clearTrigger}`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {renderFilter('validated',
            <FilterAutocomplete
              fullWidth
              label="Verificado"
              options={["Sí", "No"]}
              onChange={(_, value) => handleFilterChange("validated", value)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              value={filters.validated || null}
              key={`validated-${clearTrigger}`}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Accordion expanded={expandedAccordion} onChange={() => setExpandedAccordion(!expandedAccordion)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Filtros adicionales</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('menu',
                    <FilterAutocomplete
                      fullWidth
                      label="Filtrar por Menú"
                      options={uniqueValues.menus}
                      onChange={(_, value) => handleFilterChange("menu", value)}
                      getOptionLabel={(option) => option || ""}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={filters.menu || null}
                      key={`menu-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('allergy',
                    <FilterAutocomplete
                      fullWidth
                      label="Filtrar por Alergia"
                      options={uniqueValues.allergies}
                      onChange={(_, value) => handleFilterChange("allergies", value)}
                      getOptionLabel={(option) => option.name || ""}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      multiple
                      value={filters.allergies || []}
                      key={`allergy-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('needs_hotel',
                    <FilterAutocomplete
                      fullWidth
                      label="Necesita Hotel"
                      options={["Sí", "No"]}
                      onChange={(_, value) => handleFilterChange("needs_hotel", value)}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={filters.needs_hotel || null}
                      key={`needs_hotel-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('needs_transport',
                    <FilterAutocomplete
                      fullWidth
                      label="Necesita Transporte"
                      options={["Sí", "No"]}
                      onChange={(_, value) => handleFilterChange("needs_transport", value)}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={filters.needs_transport || null}
                      key={`needs_transport-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('needs_transport_back',
                    <FilterAutocomplete
                      fullWidth
                      label="Necesita Transporte de Vuelta"
                      options={["Sí", "No"]}
                      onChange={(_, value) => handleFilterChange("needs_transport_back", value)}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={filters.needs_transport_back || null}
                      key={`needs_transport_back-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('tags',
                    <FilterAutocomplete
                      fullWidth
                      label="Filtrar por Etiquetas"
                      options={uniqueValues.tags}
                      onChange={(_, value) => handleFilterChange("tags", value)}
                      multiple={true}
                      renderTags={renderTagChips}
                      renderOption={renderTagOption}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      value={filters.tags || []}
                      key={`tags-${clearTrigger}`}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('accommodation_plan',
                    <FilterAutocomplete
                      fullWidth
                      label="Filtrar por Plan de Alojamiento"
                      options={uniqueValues.accommodationPlans}
                      onChange={(_, value) => handleFilterChange("accommodation_plan", value)}
                      getOptionLabel={(option) => option || ""}
                      isOptionEqualToValue={(option, value) => option === value}
                      value={filters.accommodation_plan || null}
                      key={`accommodation_plan-${clearTrigger}`}
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
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

GuestFilters.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      menu: PropTypes.string,
      accommodation_plan: PropTypes.string,
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  allergies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleFilters: PropTypes.shape({
    full_name: PropTypes.bool,
    phone: PropTypes.bool,
    menu: PropTypes.bool,
    allergies: PropTypes.bool,
    needs_hotel: PropTypes.bool,
    needs_transport: PropTypes.bool,
    needs_transport_back: PropTypes.bool,
    validated: PropTypes.bool,
    tags: PropTypes.bool,
    accommodation_plan: PropTypes.bool,
  }).isRequired,
};

export default GuestFilters;