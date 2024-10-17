// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Modal, Box, Typography } from "@mui/material";

// Hooks propios
import {useMenus} from "../../../hooks";

// Componentes genéricos
import { DeleteConfirmationDialog } from "../../../components";

// Componentes propios
import {MenuList, MenuForm} from "./index";

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

  return (
    <Modal open={open} onClose={handleCloseAndReset}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Gestionar Menús del Evento
        </Typography>
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
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación de menú"
          content={`¿Estás seguro de que quieres eliminar el menú "${menuToDelete?.name}"? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          confirmButtonText="Eliminar menú"
        />
      </Box>
    </Modal>
  );
};

MenuModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MenuModal;