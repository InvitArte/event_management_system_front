import React, { useState, useEffect, useMemo } from "react";
import { Box, Autocomplete, TextField, Chip } from "@mui/material";
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../Utils/tagColors";

const GuestFilters = ({ guests, onFilterChange, tags, visibleFilters }) => {
  const [filters, setFilters] = useState({});

  const uniqueMenus = useMemo(
    () => [...new Set(guests.map((guest) => guest.menu))],
    [guests]
  );
  const uniqueAllergies = useMemo(
    () => [...new Set(guests.map((guest) => guest.allergy))],
    [guests]
  );
  const uniqueAccommodationPlans = useMemo(
    () => [...new Set(guests.map((guest) => guest.accommodation_plan))],
    [guests]
  );

  const uniqueTags = useMemo(() => {
    const uniqueTagsSet = new Set();
    tags.forEach((tag) => {
      if (!uniqueTagsSet.has(tag.name)) {
        uniqueTagsSet.add(tag.name);
      }
    });
    return Array.from(uniqueTagsSet).map((tagName) => ({
      name: tagName,
      color: stringToColor(tagName),
    }));
  }, [tags]);

  const handleFilterChange = (filterName, value) => {
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
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      {visibleFilters.menu && (
        <Autocomplete
          options={uniqueMenus}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar por Menú" />
          )}
          onChange={(event, value) => handleFilterChange("menu", value)}
          sx={{ width: 300 }}
        />
      )}
      {visibleFilters.allergy && (
        <Autocomplete
          options={uniqueAllergies}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar por Alergia" />
          )}
          onChange={(event, value) => handleFilterChange("allergy", value)}
          sx={{ width: 300 }}
        />
      )}
      {visibleFilters.needs_hotel && (
        <Autocomplete
          options={["Sí", "No"]}
          renderInput={(params) => (
            <TextField {...params} label="Necesita Hotel" />
          )}
          onChange={(event, value) => handleFilterChange("needs_hotel", value)}
          sx={{ width: 200 }}
        />
      )}
      {visibleFilters.needs_transport && (
        <Autocomplete
          options={["Sí", "No"]}
          renderInput={(params) => (
            <TextField {...params} label="Necesita Transporte" />
          )}
          onChange={(event, value) =>
            handleFilterChange("needs_transport", value)
          }
          sx={{ width: 200 }}
        />
      )}
      {visibleFilters.validated && (
        <Autocomplete
          options={["Sí", "No"]}
          renderInput={(params) => <TextField {...params} label="Verificado" />}
          onChange={(event, value) => handleFilterChange("validated", value)}
          sx={{ width: 200 }}
        />
      )}
      {visibleFilters.tags && (
        <Autocomplete
          multiple
          options={uniqueTags}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar por Etiquetas" />
          )}
          onChange={(event, value) =>
            handleFilterChange(
              "tags",
              value.map((v) => v.name)
            )
          }
          renderTags={(value, getTagProps) =>
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
                    backgroundColor: backgroundColor,
                    color: textColor,
                  }}
                />
              );
            })
          }
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                {option.name}
              </li>
            );
          }}
          sx={{ width: 300 }}
        />
      )}
      {visibleFilters.accommodation_plan && (
        <Autocomplete
          options={uniqueAccommodationPlans}
          renderInput={(params) => (
            <TextField {...params} label="Filtrar por Plan de Alojamiento" />
          )}
          onChange={(event, value) =>
            handleFilterChange("accommodation_plan", value)
          }
          sx={{ width: 300 }}
        />
      )}
    </Box>
  );
};

export default GuestFilters;
