//React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { List, ListItem, ListItemText } from "@mui/material";

// Componentes propios
import LocationListItem from "./LocationListItem";

const LocationList = ({
  locations,
  expandedLocation,
  handleExpandLocation,
  setEditingLocation,
  handleDeleteLocation,
}) => (
  <List>
    {locations.length > 0 ? (
      locations.map((location) => (
        <LocationListItem
          key={location.id}
          location={location}
          expanded={expandedLocation === location.id}
          handleExpandLocation={handleExpandLocation}
          setEditingLocation={setEditingLocation}
          handleDeleteLocation={handleDeleteLocation}
          locationsCount={locations.length}
        />
      ))
    ) : (
      <ListItem>
        <ListItemText primary="No hay ubicaciones disponibles" />
      </ListItem>
    )}
  </List>
);

LocationList.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      direccion: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ).isRequired,
  expandedLocation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleExpandLocation: PropTypes.func.isRequired,
  setEditingLocation: PropTypes.func.isRequired,
  handleDeleteLocation: PropTypes.func.isRequired,
};

export default LocationList;