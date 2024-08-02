import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import QRCode from "qrcode.react";

const QRModal = ({ open, onClose, vCardData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddContact = () => {
    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contact.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isMobile ? "Añadir contacto" : "QR Code para vCard"}
      </DialogTitle>
      <DialogContent>
        {vCardData ? (
          isMobile ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddContact}
            >
              Añadir a contactos
            </Button>
          ) : (
            <QRCode value={vCardData} size={256} />
          )
        ) : (
          <p>
            No hay datos disponibles para generar el QR o añadir el contacto.
          </p>
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
