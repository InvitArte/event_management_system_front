// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Typography, Box, Link } from "@mui/material";
import { EventButton, EventInfo } from "./ConfirmationModalStyles";

/**
 * Componente EventLocations
 *
 * Este componente muestra una lista de ubicaciones de eventos.
 * Si no hay ubicaciones, no renderiza nada.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.eventLocations - Array de objetos con información de las ubicaciones
 */
const EventLocations = ({ eventLocations }) => {
  if (!eventLocations || eventLocations.length === 0) return null;

  return (
    <EventInfo>
      {renderTitle(eventLocations)}
      {eventLocations.map(renderLocation)}
    </EventInfo>
  );
};

/**
 * Renderiza el título de la sección de ubicaciones
 * @param {Array} eventLocations - Array de ubicaciones
 * @returns {React.ReactNode}
 */
const renderTitle = (eventLocations) => (
  <Typography
    variant="h6"
    align="center"
    gutterBottom
    sx={titleStyles}
  >
    {eventLocations.length > 1 ? "Ubicaciones:" : "Ubicación:"}
  </Typography>
);

/**
 * Estilos para el título
 */
const titleStyles = {
  fontFamily: "'Parisienne', regular",
  fontSize: "1.5rem"
};

/**
 * Renderiza una ubicación individual
 * @param {Object} location - Objeto con información de la ubicación
 * @param {number} index - Índice de la ubicación en el array
 * @returns {React.ReactNode}
 */
const renderLocation = (location, index) => (
  <Box key={location.id || index} sx={{ mb: 2, textAlign: "center" }}>
    <Typography
      variant="body1"
      gutterBottom
      sx={locationTextStyles}
    >
      {location.direccion || location.name}
    </Typography>
    {renderDirectionsButton(location)}
  </Box>
);

/**
 * Estilos para el texto de la ubicación
 */
const locationTextStyles = {
  fontFamily: "'Prata', serif",
  fontSize: "1rem"
};

/**
 * Renderiza el botón "Cómo llegar" si hay una URL disponible
 * @param {Object} location - Objeto con información de la ubicación
 * @returns {React.ReactNode|null}
 */
const renderDirectionsButton = (location) => {
  if (!location.url) return null;

  return (
    <Link
      href={location.url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ textDecoration: "none" }}
    >
      <EventButton variant="outlined" size="small">
        Cómo llegar
      </EventButton>
    </Link>
  );
};

EventLocations.propTypes = {
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      direccion: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default EventLocations;