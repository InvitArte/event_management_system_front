import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Grid, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { normalizeText } from "../../../components/Utils/TextUtils";
import { stringToColor } from "../../../components/Utils/TagColors";
import TagChip from "../../../components/Ui/TagChip";
import FilterAutocomplete from "../../../components/Ui/FilterAutocomplete";

const GuestFilters = ({ guests, onFilterChange, tags, allergies, visibleFilters }) => {
  const [filters, setFilters] = useState({});
  const [expandedAccordion, setExpandedAccordion] = useState(false);

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
      
      if (Object.keys(newFilters).length === 0) {
        onFilterChange({});
      } else {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
  }, [onFilterChange]);

  useEffect(() => {
    const normalizedFilters = { ...filters };
    if (normalizedFilters.full_name) {
      normalizedFilters.full_name = normalizeText(normalizedFilters.full_name);
    }
    onFilterChange(normalizedFilters);
  }, [filters, onFilterChange]);

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
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {renderFilter('tags', 
                    <FilterAutocomplete
                      fullWidth
                      label="Filtrar por Etiquetas"
                      options={uniqueValues.tags}
                      onChange={(_, value) => handleFilterChange("tags", value.map((v) => v.name))}
                      multiple={true}
                      renderTags={renderTagChips}
                      renderOption={renderTagOption}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      value={filters.tags ? filters.tags.map(tagName => uniqueValues.tags.find(t => t.name === tagName)) : []}
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
                    />
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="outlined" 
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