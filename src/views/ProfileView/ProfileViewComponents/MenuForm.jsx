import React from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const MenuForm = ({
  editingMenu,
  isCreating,
  newMenu,
  setEditingMenu,
  handleUpdateMenu,
  setIsCreating,
  setNewMenu,
  handleAddMenu,
}) => {
  if (editingMenu) {
    return (
      <EditMenuForm
        editingMenu={editingMenu}
        setEditingMenu={setEditingMenu}
        handleUpdateMenu={handleUpdateMenu}
      />
    );
  }

  return (
    <AddMenuForm
      isCreating={isCreating}
      newMenu={newMenu}
      setIsCreating={setIsCreating}
      setNewMenu={setNewMenu}
      handleAddMenu={handleAddMenu}
    />
  );
};

MenuForm.propTypes = {
  editingMenu: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }),
  isCreating: PropTypes.bool.isRequired,
  newMenu: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  setEditingMenu: PropTypes.func.isRequired,
  handleUpdateMenu: PropTypes.func.isRequired,
  setIsCreating: PropTypes.func.isRequired,
  setNewMenu: PropTypes.func.isRequired,
  handleAddMenu: PropTypes.func.isRequired,
};

const EditMenuForm = ({ editingMenu, setEditingMenu, handleUpdateMenu }) => (
  <Box sx={{ mt: 2 }}>
    <TextField
      value={editingMenu.name}
      onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
      fullWidth
      size="small"
      label="Nombre del Menú"
      sx={{ mb: 1 }}
    />
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
      <Button onClick={handleUpdateMenu} variant="contained" color="primary">
        Actualizar
      </Button>
      <Button onClick={() => setEditingMenu(null)} variant="outlined" color="secondary">
        Cancelar
      </Button>
    </Box>
  </Box>
);

EditMenuForm.propTypes = {
  editingMenu: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setEditingMenu: PropTypes.func.isRequired,
  handleUpdateMenu: PropTypes.func.isRequired,
};

const AddMenuForm = ({
  isCreating,
  newMenu,
  setIsCreating,
  setNewMenu,
  handleAddMenu,
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
        Crear nuevo menú
      </Button>
    ) : (
      <>
        <TextField
          value={newMenu.name}
          onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          placeholder="Nombre del menú"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        />
        <Button
          onClick={handleAddMenu}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Añadir Menú
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

AddMenuForm.propTypes = {
  isCreating: PropTypes.bool.isRequired,
  newMenu: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  setIsCreating: PropTypes.func.isRequired,
  setNewMenu: PropTypes.func.isRequired,
  handleAddMenu: PropTypes.func.isRequired,
};

export default MenuForm;