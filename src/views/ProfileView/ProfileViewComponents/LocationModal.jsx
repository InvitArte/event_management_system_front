import React from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography } from "@mui/material";
import {useLocations} from "../../../hooks";
import LocationList from "./LocationList";
import LocationForm from "./LocationForm";

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
  const {
    locations,
    expandedLocation,
    editingLocation,
    isCreating,
    newLocation,
    handleExpandLocation,
    setEditingLocation,
    handleDeleteLocation,
    handleUpdateLocation,
    setIsCreating,
    setNewLocation,
    handleAddLocation,
    resetState,
  } = useLocations(open);

  const handleCloseAndReset = () => {
    resetState();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleCloseAndReset}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Gestionar Ubicaciones del Evento
        </Typography>
        <LocationList
          locations={locations}
          expandedLocation={expandedLocation}
          handleExpandLocation={handleExpandLocation}
          setEditingLocation={setEditingLocation}
          handleDeleteLocation={handleDeleteLocation}
        />
        <LocationForm
          editingLocation={editingLocation}
          isCreating={isCreating}
          newLocation={newLocation}
          setEditingLocation={setEditingLocation}
          handleUpdateLocation={handleUpdateLocation}
          setIsCreating={setIsCreating}
          setNewLocation={setNewLocation}
          handleAddLocation={handleAddLocation}
        />
      </Box>
    </Modal>
  );
};

LocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default LocationModal;