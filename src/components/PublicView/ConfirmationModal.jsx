import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  styled,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationForm from "./ConfirmationForm";
import { publicService } from "../../services/Api";
import "../../styles/fonts.css";
import aguja from "../../assets/imgs/aguja.svg";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#231f20",
    borderRadius: "15px",
    color: "white",
    fontFamily: "'Prata', serif",
    position: "relative",
    padding: "24px 24px 16px",
    WebkitOverflowScrolling: "touch",
    maxWidth: "100%",
    width: "100%",
    margin: "10px",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "500px",
      width: "calc(100% - 64px)",
      margin: "32px",
    },
  },
}));

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: "white",
  fontFamily: "'Prata', serif",
  fontSize: "22px",
  padding: "0 40px 8px",
  textAlign: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
}));

const CustomDialogContent = styled(DialogContent)({
  color: "white",
  fontFamily: "'Prata', serif",
  paddingTop: "16px",
  WebkitOverflowScrolling: "touch",
});

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#a3a3a3",
  color: "white",
  border: "none",
  padding: "12px 24px",
  fontSize: "16px",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "2px 2px 4px rgba(49, 49, 49, 0.5)",
  margin: "1rem auto",
  transition: "background-color 0.3s ease",
  fontFamily: "'Prata', serif",
  minWidth: "200px",
  WebkitTapHighlightColor: "transparent",
  "&:hover": {
    backgroundColor: "#868686",
  },
  "&:disabled": {
    backgroundColor: "#4a4a4a",
    color: "#8a8a8a",
    cursor: "not-allowed",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    padding: "10px 20px",
    minWidth: "160px",
  },
}));

const CloseButton = styled(IconButton)({
  position: "absolute",
  right: 8,
  top: 8,
  color: "white",
  WebkitTapHighlightColor: "transparent",
  padding: "12px",
});

const ImageContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
  marginBottom: "24px",
});

const StyledImage = styled("img")({
  width: "80px",
  height: "auto",
});

const SuccessMessage = styled(Typography)({
  color: "white",
  fontFamily: "'Prata', serif",
  textAlign: "center",
  marginBottom: "24px",
  fontSize: "18px",
});

const ErrorMessage = styled(Typography)({
  color: "#ff6b6b",
  fontFamily: "'Prata', serif",
  textAlign: "center",
  marginBottom: "16px",
  fontSize: "14px",
});

const ConfirmationModal = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(null);
      setIsSubmitted(false);
      setIsFormValid(false);
      setFormErrors({});
      setIsSubmitting(false);
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
    const requiredFields = ["first_name", "last_name", "phone", "email"];

    requiredFields.forEach((field) => {
      if (!formData?.guest[field]) {
        errors[field] = `El campo "${getFieldName(field)}" es obligatorio.`;
      }
    });

    if (formData?.hasPlusOne === "yes") {
      ["first_name", "last_name"].forEach((field) => {
        if (!formData.plus_one[field]) {
          errors[`plus_one_${field}`] = `El campo "${getFieldName(
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
