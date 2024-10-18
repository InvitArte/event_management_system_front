// React y hooks
import React, { useState } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { TextField, Box } from "@mui/material";

const ChangePasswordForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(currentPassword, newPassword, confirmNewPassword);
  };

  return (
    <form onSubmit={handleSubmit} id="change-password-form">
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
    </form>
  );
};

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ChangePasswordForm;