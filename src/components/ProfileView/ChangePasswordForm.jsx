import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ChangePasswordForm = ({ handleUpdatePassword, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePassword(currentPassword, newPassword, confirmNewPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Contraseña Actual"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Nueva Contraseña"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Confirmar Nueva Contraseña"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
      />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleClose} sx={{ mr: 1 }}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Cambiar Contraseña
        </Button>
      </Box>
    </form>
  );
};

export default ChangePasswordForm;
