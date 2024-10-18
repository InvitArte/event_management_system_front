// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

//Servicios
import {IS_DEMO} from "../../../config/api/BaseUrl";

const LocationListItem = ({
  location,
  expanded,
  handleExpandLocation,
  setEditingLocation,
  handleDeleteLocation,
  locationsCount,
}) => (
  <React.Fragment>
    <ListItem disableGutters>
      <ListItemText primary={location.name} />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="expand"
          onClick={() => handleExpandLocation(location.id)}
          size="small"
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={() => setEditingLocation(location)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        {(!IS_DEMO || (IS_DEMO && locationsCount <= 1)) && (
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteLocation(location)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
      </ListItemSecondaryAction>
    </ListItem>
    <Collapse in={expanded}>
      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
        <Typography variant="body2">Dirección: {location.direccion}</Typography>
        <Typography variant="body2">
          Capacidad: {location.capacity ? location.capacity : "No especificada"}
        </Typography>
        {location.url && (
          <Typography variant="body2">URL: {location.url}</Typography>
        )}
      </Box>
    </Collapse>
  </React.Fragment>
);

LocationListItem.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    url: PropTypes.string,
    capacity: PropTypes.string,
  }).isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpandLocation: PropTypes.func.isRequired,
  setEditingLocation: PropTypes.func.isRequired,
  handleDeleteLocation: PropTypes.func.isRequired,
  locationsCount: PropTypes.number.isRequired,
};

export default LocationListItem;