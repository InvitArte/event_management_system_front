// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Typography } from "@mui/material";

// Hooks propios
import { useLocations } from "../../../hooks";

// Componentes genéricos
import { ReusableModal, DeleteConfirmationDialog } from "../../../components";

// Componentes propios
import { LocationList, LocationForm } from "./index";

const LocationModal = ({ open, handleClose }) => {
  const {
    locations,
    expandedLocation,
    editingLocation,
    isCreating,
    newLocation,
    handleExpandLocation,
    setEditingLocation,
    handleUpdateLocation,
    setIsCreating,
    setNewLocation,
    handleAddLocation,
    resetState,
    deleteDialogOpen,
    locationToDelete,
    handleDeleteLocation,
    handleConfirmDelete,
    setDeleteDialogOpen,
  } = useLocations(open);

  const handleCloseAndReset = () => {
    resetState();
    handleClose();
  };

  const modalContent = (
    <>
      <Box sx={{ width: '100%' }}>
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
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación de ubicación"
        content={`¿Estás seguro de que quieres eliminar la ubicación "${locationToDelete?.name}"? Esta acción no se puede deshacer.`}
        cancelButtonText="Cancelar"
        confirmButtonText="Eliminar ubicación"
      />
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={handleCloseAndReset}
      title="Gestionar Ubicaciones"
      maxWidth="md"
      fullWidth
      submitButtonText="Cerrar"
      onSubmit={handleCloseAndReset}
      hideSubmitButton={true}
    >
      {modalContent}
    </ReusableModal>
  );
};

LocationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default LocationModal;