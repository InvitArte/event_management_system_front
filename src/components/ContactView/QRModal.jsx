import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import QRCode from "qrcode.react";

const QRModal = ({ open, onClose, vCardData }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>QR Code para vCard</DialogTitle>
      <DialogContent>
        {vCardData ? (
          <QRCode value={vCardData} size={256} />
        ) : (
          <p>No hay datos disponibles para generar el QR.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

QRModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vCardData: PropTypes.string.isRequired,
};

export default QRModal;
