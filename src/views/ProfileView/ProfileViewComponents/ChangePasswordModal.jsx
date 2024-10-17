// React y hooks
import React, { useState } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Typography } from "@mui/material";

// Servicios
import { authService } from "../../../services/Api";

// Componentes genéricos
import { ReusableModal } from "../../../components";

// Componentes propios
import ChangePasswordForm from "./ChangePasswordForm";


const ChangePasswordModal = ({ open, handleClose }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    if (newPassword !== confirmNewPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.updatePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      handleClose();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setError("Error al cambiar la contraseña. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReusableModal
      open={open}
      onClose={handleClose}
      title="Cambiar Contraseña"
      maxWidth="sm"
      fullWidth
      submitButtonText="Cambiar Contraseña"
      onSubmit={() => document.getElementById("change-password-form").requestSubmit()}
      loading={loading}
      error={error}
    >
      <Box sx={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
        <ChangePasswordForm onSubmit={handleUpdatePassword} />
      </Box>
    </ReusableModal>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;