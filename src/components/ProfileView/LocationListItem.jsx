import React from "react";
import PropTypes from "prop-types";
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

const LocationListItem = ({
  location,
  expanded,
  handleExpandLocation,
  setEditingLocation,
  handleDeleteLocation,
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
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => handleDeleteLocation(location.id)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
    <Collapse in={expanded}>
      <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
        <Typography variant="body2">Dirección: {location.direccion}</Typography>
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
  }).isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpandLocation: PropTypes.func.isRequired,
  setEditingLocation: PropTypes.func.isRequired,
  handleDeleteLocation: PropTypes.func.isRequired,
};

export default LocationListItem;
