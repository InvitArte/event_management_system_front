// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Typography } from "@mui/material";

// Hooks propios
import { useMenus } from "../../../hooks";

// Componentes genéricos
import { ReusableModal, DeleteConfirmationDialog } from "../../../components";

// Componentes propios
import { MenuList, MenuForm } from "./index";

const MenuModal = ({ open, handleClose }) => {
  const {
    menus,
    expandedMenu,
    editingMenu,
    isCreating,
    newMenu,
    handleExpandMenu,
    setEditingMenu,
    handleDeleteMenu,
    handleUpdateMenu,
    setIsCreating,
    setNewMenu,
    handleAddMenu,
    resetState,
    deleteDialogOpen,
    menuToDelete,
    handleConfirmDelete,
    setDeleteDialogOpen,
  } = useMenus(open);

  const handleCloseAndReset = () => {
    resetState();
    handleClose();
  };

  const modalContent = (
    <>
      <Box sx={{ width: '100%' }}>
        <MenuList
          menus={menus}
          expandedMenu={expandedMenu}
          handleExpandMenu={handleExpandMenu}
          setEditingMenu={setEditingMenu}
          handleDeleteMenu={handleDeleteMenu}
        />
        <MenuForm
          editingMenu={editingMenu}
          isCreating={isCreating}
          newMenu={newMenu}
          setEditingMenu={setEditingMenu}
          handleUpdateMenu={handleUpdateMenu}
          setIsCreating={setIsCreating}
          setNewMenu={setNewMenu}
          handleAddMenu={handleAddMenu}
        />
      </Box>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación de menú"
        content={`¿Estás seguro de que quieres eliminar el menú "${menuToDelete?.name}"? Esta acción no se puede deshacer.`}
        cancelButtonText="Cancelar"
        confirmButtonText="Eliminar menú"
      />
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={handleCloseAndReset}
      title="Gestionar Menús del Evento"
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

MenuModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MenuModal;