// React y hooks
import React, { useState, useCallback, useEffect } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { DialogActions, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Componentes propios y estilos personalizados0
import ConfirmationForm from "./ConfirmationForm";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CloseButton,
  ImageContainer,
  StyledImage,
  SuccessMessage,
  ErrorMessage,
  EventButton,
} from "./ConfirmationModalStyles";

// Servicios
import { publicService } from "../../../services/Api";

// Estilos globales
import "../../../styles/fonts.css";

const ConfirmationModal = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFormData(null);
        setIsSubmitted(false);
        setIsFormValid(false);
        setFormErrors({});
        setIsSubmitting(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleFormChange = useCallback((data) => {
    setFormData(data);
  }, []);

  const handleValidationChange = useCallback((isValid) => {
    setIsFormValid(isValid);
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData) return false;

    const validateField = (section, field, message) => {
      if (!formData[section][field]) {
        errors[`${section}.${field}`] = message;
      }
    };

    validateField("guest", "first_name", "El nombre es requerido");
    validateField("guest", "last_name", "El apellido es requerido");
    validateField("guest", "phone", "El teléfono es requerido");
    validateField("guest", "email", "El email es requerido");
    validateField("guest", "menu_id", "El menú es requerido");

    if (formData.hasPlusOne === "yes") {
      validateField(
        "plus_one",
        "first_name",
        "El nombre del acompañante es requerido"
      );
      validateField(
        "plus_one",
        "last_name",
        "El apellido del acompañante es requerido"
      );
      validateField(
        "plus_one",
        "menu_id",
        "El menú del acompañante es requerido"
      );
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const guestData = {
        ...formData.guest,
        user_id: userId,
        allergies: formData.guest.allergies.map(allergy => allergy.id),
      };

      const plusOneData = formData.hasPlusOne === "yes"
        ? {
            ...formData.plus_one,
            allergies: formData.plus_one.allergies.map(allergy => allergy.id),
          }
        : null;

      await publicService.createGuestWithPlusOne(guestData, plusOneData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors = {};

        Object.keys(serverErrors).forEach((key) => {
          if (key.startsWith("guest.") || key.startsWith("plus_one.")) {
            newErrors[key] = serverErrors[key][0];
          } else {
            newErrors[`guest.${key}`] = serverErrors[key][0];
          }
        });

        setFormErrors(newErrors);
      } else {
        setFormErrors({
          submit:
            "Hubo un error al enviar el formulario. Por favor, intente nuevamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userId, validateForm, isSubmitting]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <CustomDialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      disableScrollLock
      aria-labelledby="confirmation-dialog-title"
    >
      <CloseButton onClick={handleClose} aria-label="cerrar">
        <CloseIcon />
      </CloseButton>
      <CustomDialogTitle id="confirmation-dialog-title">
        {isSubmitted ? "¡Gracias por confirmar!" : "¿Te gustaría acompañarnos?"}
      </CustomDialogTitle>
      <CustomDialogContent>
        {isSubmitted ? (
          <SuccessMessage>¡Nos vemos en la boda!</SuccessMessage>
        ) : (
          <ConfirmationForm
            onFormChange={handleFormChange}
            onValidationChange={handleValidationChange}
            formErrors={formErrors}
          />
        )}
        {formErrors.submit && <ErrorMessage>{formErrors.submit}</ErrorMessage>}
      </CustomDialogContent>
      <DialogActions
        style={{
          justifyContent: "center",
          padding: isMobile ? "16px" : "8px 0",
        }}
      >
        {isSubmitted ? (
          <EventButton onClick={handleClose} fullWidth={isMobile}>
            Cerrar
          </EventButton>
        ) : (
          <EventButton
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            aria-label="confirmar asistencia"
            fullWidth={isMobile}
          >
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </EventButton>
        )}
      </DialogActions>
    </CustomDialog>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const MemoizedConfirmationModal = React.memo(ConfirmationModal);

export default MemoizedConfirmationModal;