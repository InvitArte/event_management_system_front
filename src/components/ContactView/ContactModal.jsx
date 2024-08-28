/**
 * @file ContactModal.jsx
 * @description Componente modal para la creación y edición de contactos.
 */

import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { contactService } from "../../services/Api";
import ContactForm from "./ContactForm";

/**
 * @typedef {Object} Contact
 * @property {number} id - Identificador único del contacto
 * @property {string} name - Nombre del contacto
 * @property {string} email - Correo electrónico del contacto
 * @property {string} phone - Número de teléfono del contacto
 * @property {string} description - Descripción del contacto
 * @property {string} observation - Observaciones sobre el contacto
 */

/**
 * @function ContactModal
 * @description Componente modal para crear o editar un contacto.
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Indica si el modal está abierto
 * @param {function} props.onClose - Función para cerrar el modal
 * @param {Contact} [props.contact] - Contacto a editar (si es null, se crea un nuevo contacto)
 * @param {function} props.onSubmit - Función a llamar después de guardar el contacto
 * @returns {JSX.Element} Elemento JSX que representa el modal de contacto
 */
const ContactModal = ({ open, onClose, contact, onSubmit }) => {
  /** @type {[boolean, function]} loading */
  const [loading, setLoading] = useState(false);

  /** @type {[string, function]} error */
  const [error, setError] = useState("");

  /**
   * @function handleSubmit
   * @description Maneja la submisión del formulario de contacto.
   * @param {Object} formData - Datos del formulario
   */
  const handleSubmit = useCallback(
    async (formData) => {
      setLoading(true);
      setError("");
      try {
        const contactData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          observation: formData.observation,
        };

        const response = contact
          ? await contactService.updateContact(contact.id, contactData)
          : await contactService.createContact(contactData);

        onSubmit();
        onClose();
      } catch (err) {
        console.error("Error submitting contact:", err);
        setError(handleErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [contact, onSubmit, onClose]
  );

  /**
   * @function handleErrorMessage
   * @description Genera un mensaje de error legible a partir de un error de la API.
   * @param {Error} err - Error capturado
   * @returns {string} Mensaje de error formateado
   */
  const handleErrorMessage = useCallback((err) => {
    if (err.response) {
      if (err.response.data && err.response.data.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("; ");
        return `Failed to save contact: ${errorMessages}`;
      } else if (err.response.data && err.response.data.message) {
        return `Failed to save contact: ${err.response.data.message}`;
      } else {
        return `Failed to save contact. Server responded with status ${err.response.status}`;
      }
    } else if (err.request) {
      return "Failed to save contact. No response received from server.";
    } else {
      return `Failed to save contact: ${err.message}`;
    }
  }, []);

  /**
   * @type {string}
   * @description Título del modal, cambia según si se está creando o editando un contacto
   */
  const modalTitle = useMemo(
    () => (contact ? "Editar Contacto" : "Crear Nuevo Contacto"),
    [contact]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <ContactForm contact={contact} onSubmit={handleSubmit} />
        {error && (
          <Typography
            color="error"
            align="center"
            style={{ marginTop: "1rem" }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          onClick={() => document.getElementById("contact-form-submit").click()}
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ContactModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    description: PropTypes.string,
    observation: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default ContactModal;
