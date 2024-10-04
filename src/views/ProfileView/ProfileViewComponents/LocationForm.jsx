// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, TextField, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const LocationForm = ({
  editingLocation,
  isCreating,
  newLocation,
  setEditingLocation,
  handleUpdateLocation,
  setIsCreating,
  setNewLocation,
  handleAddLocation,
}) => {
  if (editingLocation) {
    return (
      <EditLocationForm
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        handleUpdateLocation={handleUpdateLocation}
      />
    );
  }

  return (
    <AddLocationForm
      isCreating={isCreating}
      newLocation={newLocation}
      setIsCreating={setIsCreating}
      setNewLocation={setNewLocation}
      handleAddLocation={handleAddLocation}
    />
  );
};

LocationForm.propTypes = {
  editingLocation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    url: PropTypes.string,
    capacity: PropTypes.string, // Changed to string
  }),
  isCreating: PropTypes.bool.isRequired,
  newLocation: PropTypes.shape({
    name: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    url: PropTypes.string,
    capacity: PropTypes.string, // Changed to string
  }).isRequired,
  setEditingLocation: PropTypes.func.isRequired,
  handleUpdateLocation: PropTypes.func.isRequired,
  setIsCreating: PropTypes.func.isRequired,
  setNewLocation: PropTypes.func.isRequired,
  handleAddLocation: PropTypes.func.isRequired,
};

const EditLocationForm = ({
  editingLocation,
  setEditingLocation,
  handleUpdateLocation,
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
    <TextField
      value={editingLocation.capacity}
      onChange={(e) =>
        setEditingLocation({ ...editingLocation, capacity: e.target.value })
      }
      fullWidth
      size="small"
      label="Capacidad"
      type="number"
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
      <Button
        onClick={() => setEditingLocation(null)}
        variant="outlined"
        color="secondary"
      >
        Cancelar
      </Button>
    </Box>
  </Box>
);

EditLocationForm.propTypes = {
  editingLocation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    url: PropTypes.string,
    capacity: PropTypes.string, // Changed to string
  }).isRequired,
  setEditingLocation: PropTypes.func.isRequired,
  handleUpdateLocation: PropTypes.func.isRequired,
};

const AddLocationForm = ({
  isCreating,
  newLocation,
  setIsCreating,
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
        <TextField
          value={newLocation.url}
          onChange={(e) =>
            setNewLocation({ ...newLocation, url: e.target.value })
          }
          placeholder="Nueva URL"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        />
        <TextField
          value={newLocation.capacity}
          onChange={(e) =>
            setNewLocation({ ...newLocation, capacity: e.target.value })
          }
          placeholder="Capacidad"
          fullWidth
          size="small"
          type="number"
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

AddLocationForm.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  newLocation: PropTypes.shape({
    name: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    url: PropTypes.string,
    capacity: PropTypes.string,
  }).isRequired,
  setIsCreating: PropTypes.func.isRequired,
  setNewLocation: PropTypes.func.isRequired,
  handleAddLocation: PropTypes.func.isRequired,
};

export default LocationForm;
