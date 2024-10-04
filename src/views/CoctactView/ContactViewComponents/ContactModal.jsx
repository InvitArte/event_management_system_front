// React y hooks
import React, { useState, useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI componentes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

// Servicios
import { contactService } from "../../../services/Api";

// Componentes propios
import ContactForm from "./ContactForm";
import { CloseButton } from "../../../components";

const ContactModal = ({ open, onClose, contact, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const modalTitle = useMemo(
    () => (contact ? "Editar Contacto" : "Crear Nuevo Contacto"),
    [contact]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { overflow: 'visible' } }}>
      <DialogTitle sx={{ position: 'relative', paddingRight: '40px' }}>
        {modalTitle}
        <CloseButton onClose={onClose} />
      </DialogTitle>
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