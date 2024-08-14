import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { DialogActions } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationForm from "./ConfirmationForm";
import { publicService } from "../../services/Api";
import "../../styles/fonts.css";
import aguja from "../../assets/imgs/aguja.svg";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomButton,
  CloseButton,
  ImageContainer,
  StyledImage,
  SuccessMessage,
  ErrorMessage,
} from "./ConfirmationModalStyles";

const ConfirmationModal = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const { guest, plus_one, hasPlusOne } = formData;
    const requiredFields = ["first_name", "last_name", "phone", "email"];

    requiredFields.forEach((field) => {
      if (!guest[field]) {
        errors[`guest.${field}`] = `El campo "${getFieldName(
          field
        )}" es obligatorio.`;
      }
    });

    if (hasPlusOne === "yes") {
      ["first_name", "last_name"].forEach((field) => {
        if (!plus_one[field]) {
          errors[`plus_one.${field}`] = `El campo "${getFieldName(
            field
          )}" del acompañante es obligatorio.`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const getFieldName = useCallback((field) => {
    const fieldNames = {
      first_name: "Nombre",
      last_name: "Apellido",
      phone: "Teléfono",
      email: "Email",
    };
    return fieldNames[field] || field;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const guestData = {
      ...formData.guest,
      user_id: userId,
    };

    const plusOneData =
      formData.hasPlusOne === "yes" ? formData.plus_one : null;

    try {
      await publicService.createGuestWithPlusOne(guestData, plusOneData);
      setIsSubmitted(true);
      setFormErrors({});
    } catch (error) {
      console.error("Error creating guest:", error);
      setFormErrors({
        submit:
          "Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.",
      });
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
      disableScrollLock
      aria-labelledby="confirmation-dialog-title"
    >
      <CloseButton onClick={handleClose} aria-label="cerrar">
        <CloseIcon />
      </CloseButton>
      <ImageContainer>
        <StyledImage src={aguja} alt="Imagen de aguja" />
      </ImageContainer>
      <CustomDialogTitle id="confirmation-dialog-title">
        {isSubmitted ? "¡Gracias por confirmar!" : "¿Te gustaría acompañarnos?"}
      </CustomDialogTitle>
      <CustomDialogContent>
        {isSubmitted ? (
          <SuccessMessage>¡Nos vemos en el desfile!</SuccessMessage>
        ) : (
          <ConfirmationForm
            onFormChange={handleFormChange}
            onValidationChange={handleValidationChange}
            formErrors={formErrors}
          />
        )}
        {formErrors.submit && <ErrorMessage>{formErrors.submit}</ErrorMessage>}
      </CustomDialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        {isSubmitted ? (
          <CustomButton onClick={handleClose}>Cerrar</CustomButton>
        ) : (
          <CustomButton
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            aria-label="confirmar asistencia"
          >
            {isSubmitting ? "Enviando..." : "Confirmar"}
          </CustomButton>
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

export default React.memo(ConfirmationModal);
