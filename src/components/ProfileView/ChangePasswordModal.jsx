import React from "react";
import PropTypes from "prop-types";
import { Modal, Box, Typography } from "@mui/material";
import ChangePasswordForm from "./ChangePasswordForm";
import { authService } from "../../services/Api";

const ChangePasswordModal = ({ open, handleClose }) => {
  const handleUpdatePassword = async (
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    if (newPassword !== confirmNewPassword) {
      alert("Las nuevas contraseñas no coinciden");
      return;
    }
    try {
      await authService.updatePassword(
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      handleClose();
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Cambiar Contraseña
        </Typography>
        <ChangePasswordForm
          handleUpdatePassword={handleUpdatePassword}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
