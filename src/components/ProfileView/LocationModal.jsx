import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { locationService } from "../../services/Api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

const LocationModal = ({ open, handleClose }) => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    direccion: "",
    url: "",
  });
  const [editingLocation, setEditingLocation] = useState(null);
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await locationService.getAllLocations();
      setLocations(response);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchLocations();
    }
  }, [open, fetchLocations]);

  const handleAddLocation = async () => {
    if (newLocation.name.trim()) {
      try {
        await locationService.createLocation(newLocation);
        setNewLocation({ name: "", direccion: "", url: "" });
        setIsCreating(false);
        fetchLocations();
      } catch (error) {
        console.error("Error adding location:", error);
      }
    }
  };

  const handleUpdateLocation = async () => {
    if (editingLocation && editingLocation.name.trim()) {
      try {
        await locationService.updateLocation(
          editingLocation.id,
          editingLocation
        );
        setEditingLocation(null);
        fetchLocations();
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await locationService.deleteLocation(id);
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleExpandLocation = (id) => {
    setExpandedLocation(expandedLocation === id ? null : id);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Gestionar Ubicaciones de la Boda
        </Typography>
        <LocationList
          locations={locations}
          expandedLocation={expandedLocation}
          handleExpandLocation={handleExpandLocation}
          setEditingLocation={setEditingLocation}
          handleDeleteLocation={handleDeleteLocation}
        />
        {editingLocation && (
          <EditLocationForm
            editingLocation={editingLocation}
            setEditingLocation={setEditingLocation}
            handleUpdateLocation={handleUpdateLocation}
            handleCancelEdit={() => setEditingLocation(null)}
          />
        )}
        <AddLocationForm
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          handleAddLocation={handleAddLocation}
        />
      </Box>
    </Modal>
  );
};

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
        />
      ))
    ) : (
      <ListItem>
        <ListItemText primary="No hay ubicaciones disponibles" />
      </ListItem>
    )}
  </List>
);

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

const EditLocationForm = ({
  editingLocation,
  setEditingLocation,
  handleUpdateLocation,
  handleCancelEdit,
}) => (
  <Box sx={{ mt: 2 }}>
    <TextField
      value={editingLocation.name}
      onChange={(e) =>
        setEditingLocation({ ...editingLocation, name: e.target.value })
      }
      fullWidth
      size="small"
      label="Nombre"
      sx={{ mb: 1 }}
    />
    <TextField
      value={editingLocation.direccion}
      onChange={(e) =>
        setEditingLocation({ ...editingLocation, direccion: e.target.value })
      }
      fullWidth
      size="small"
      label="Dirección"
      sx={{ mb: 1 }}
    />
    <TextField
      value={editingLocation.url}
      onChange={(e) =>
        setEditingLocation({ ...editingLocation, url: e.target.value })
      }
      fullWidth
      size="small"
      label="URL"
      sx={{ mb: 1 }}
    />
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
      <Button
        onClick={handleUpdateLocation}
        variant="contained"
        color="primary"
      >
        Actualizar
      </Button>
      <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
        Cancelar
      </Button>
    </Box>
  </Box>
);

const AddLocationForm = ({
  isCreating,
  setIsCreating,
  newLocation,
  setNewLocation,
  handleAddLocation,
}) => (
  <Box sx={{ mt: 2 }}>
    {!isCreating ? (
      <Button
        onClick={() => setIsCreating(true)}
        fullWidth
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
      >
        Crear nueva ubicación
      </Button>
    ) : (
      <>
        <TextField
          value={newLocation.name}
          onChange={(e) =>
            setNewLocation({ ...newLocation, name: e.target.value })
          }
          placeholder="Nuevo nombre"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          value={newLocation.direccion}
          onChange={(e) =>
            setNewLocation({ ...newLocation, direccion: e.target.value })
          }
          placeholder="Nueva dirección"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        />
        <Button
          onClick={handleAddLocation}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Añadir Ubicación
        </Button>
        <Button
          onClick={() => setIsCreating(false)}
          fullWidth
          variant="text"
          color="primary"
          sx={{ mt: 1 }}
        >
          Cancelar
        </Button>
      </>
    )}
  </Box>
);

export default LocationModal;
