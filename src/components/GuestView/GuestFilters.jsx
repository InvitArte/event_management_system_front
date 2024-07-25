import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Autocomplete, TextField, Chip } from "@mui/material";
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../Utils/tagColors";
import { normalizeText } from "../Utils/textUtils";

const FilterAutocomplete = ({
  label,
  options,
  onChange,
  width = 300,
  multiple = false,
  renderTags,
  renderOption,
}) => (
  <Autocomplete
    multiple={multiple}
    options={options}
    renderInput={(params) => <TextField {...params} label={label} />}
    onChange={onChange}
    renderTags={renderTags}
    renderOption={renderOption}
    sx={{ width }}
  />
);

const GuestFilters = ({ guests, onFilterChange, tags, visibleFilters }) => {
  const [filters, setFilters] = useState({});

  const uniqueValues = useMemo(
    () => ({
      menus: [...new Set(guests.map((guest) => guest.menu))],
      allergies: [...new Set(guests.map((guest) => guest.allergy))],
      accommodationPlans: [
        ...new Set(guests.map((guest) => guest.accommodation_plan)),
      ],
      tags: Array.from(new Set(tags.map((tag) => tag.name))).map((tagName) => ({
        name: tagName,
        color: stringToColor(tagName),
      })),
    }),
    [guests, tags]
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
    // Aplicar normalización al filtro de nombre completo
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
        const backgroundColor = adjustColor(option.color, 20);
        const textColor = getContrastColor(backgroundColor);
        return (
          <Chip
            key={key}
            {...chipProps}
            variant="filled"
            label={option.name}
            style={{
              backgroundColor,
              color: textColor,
            }}
          />
        );
      }),
    []
  );

  const renderTagOption = useCallback((props, option) => {
    const { key, ...otherProps } = props;
    return (
      <li key={key} {...otherProps}>
        {option.name}
      </li>
    );
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      {visibleFilters.full_name && (
        <TextField
          label="Buscar por nombre"
          onChange={(e) => handleFilterChange("full_name", e.target.value)}
          sx={{ width: 300 }}
        />
      )}
      {visibleFilters.menu && (
        <FilterAutocomplete
          label="Filtrar por Menú"
          options={uniqueValues.menus}
          onChange={(_, value) => handleFilterChange("menu", value)}
        />
      )}
      {visibleFilters.allergy && (
        <FilterAutocomplete
          label="Filtrar por Alergia"
          options={uniqueValues.allergies}
          onChange={(_, value) => handleFilterChange("allergy", value)}
        />
      )}
      {visibleFilters.needs_hotel && (
        <FilterAutocomplete
          label="Necesita Hotel"
          options={["Sí", "No"]}
          onChange={(_, value) => handleFilterChange("needs_hotel", value)}
          width={200}
        />
      )}
      {visibleFilters.needs_transport && (
        <FilterAutocomplete
          label="Necesita Transporte"
          options={["Sí", "No"]}
          onChange={(_, value) => handleFilterChange("needs_transport", value)}
          width={200}
        />
      )}
      {visibleFilters.validated && (
        <FilterAutocomplete
          label="Verificado"
          options={["Sí", "No"]}
          onChange={(_, value) => handleFilterChange("validated", value)}
          width={200}
        />
      )}
      {visibleFilters.tags && (
        <FilterAutocomplete
          label="Filtrar por Etiquetas"
          options={uniqueValues.tags}
          onChange={(_, value) =>
            handleFilterChange(
              "tags",
              value.map((v) => v.name)
            )
          }
          multiple={true}
          renderTags={renderTagChips}
          renderOption={renderTagOption}
        />
      )}
      {visibleFilters.accommodation_plan && (
        <FilterAutocomplete
          label="Filtrar por Plan de Alojamiento"
          options={uniqueValues.accommodationPlans}
          onChange={(_, value) =>
            handleFilterChange("accommodation_plan", value)
          }
        />
      )}
    </Box>
  );
};

export default GuestFilters;
