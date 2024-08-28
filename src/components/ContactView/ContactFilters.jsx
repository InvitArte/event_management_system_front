/**
 * @file ContactFilters.jsx
 * @description Componente para filtrar la lista de contactos.
 */

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, TextField } from "@mui/material";
import { normalizeText } from "../Utils/TextUtils";

/**
 * @typedef {Object} Filters
 * @property {string} [name] - Filtro por nombre
 * @property {string} [email] - Filtro por email
 * @property {string} [phone] - Filtro por teléfono
 */

/**
 * @function ContactFilters
 * @description Componente que proporciona campos de entrada para filtrar contactos.
 * @param {Object} props - Propiedades del componente
 * @param {function} props.onFilterChange - Función a llamar cuando cambian los filtros
 * @returns {JSX.Element} Elemento JSX que representa los filtros de contactos
 */
const ContactFilters = ({ onFilterChange }) => {
  /**
   * @type {[Filters, function]} filters
   * @description Estado para almacenar los filtros actuales
   */
  const [filters, setFilters] = useState({});

  /**
   * @function handleFilterChange
   * @description Maneja el cambio en un filtro específico
   * @param {string} filterName - Nombre del filtro a cambiar
   * @param {string} value - Nuevo valor del filtro
   */
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

  /**
   * @description Efecto para normalizar los filtros y notificar al componente padre
   */
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
