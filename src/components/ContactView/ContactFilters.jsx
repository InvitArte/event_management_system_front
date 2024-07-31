import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, TextField } from "@mui/material";
import { normalizeText } from "../Utils/TextUtils";

const ContactFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({});

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

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <TextField
        label="Buscar por nombre"
        onChange={(e) => handleFilterChange("name", e.target.value)}
        sx={{ width: 300 }}
      />
      <TextField
        label="Buscar por email"
        onChange={(e) => handleFilterChange("email", e.target.value)}
        sx={{ width: 300 }}
      />
      <TextField
        label="Buscar por teléfono"
        onChange={(e) => handleFilterChange("phone", e.target.value)}
        sx={{ width: 300 }}
      />
    </Box>
  );
};

ContactFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default ContactFilters;
