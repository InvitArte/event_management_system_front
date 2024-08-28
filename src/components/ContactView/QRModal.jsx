/**
 * @file QRModal.jsx
 * @description Componente modal para mostrar un código QR con datos de contacto o permitir la descarga directa en dispositivos móviles.
 */

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

/**
 * @function QRModal
 * @description Componente que muestra un modal con un código QR o un botón para descargar el contacto.
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Indica si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {string} props.vCardData - Datos del contacto en formato vCard
 * @returns {JSX.Element} Elemento JSX que representa el modal de QR
 */
const QRModal = ({ open, onClose, vCardData }) => {
  const theme = useTheme();
  /**
   * @type {boolean}
   * @description Indica si el dispositivo es móvil
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * @function handleAddContact
   * @description Maneja la descarga del archivo vCard
   */
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
