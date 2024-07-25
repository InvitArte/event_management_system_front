import React, { useState } from "react";
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
  List,
  ListItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationForm from "./ConfirmationForm";
import { publicService } from "../../services/api";
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
});

const CustomButton = styled(Button)({
  backgroundColor: "#a3a3a3",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  fontSize: "0.9rem",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "2px 2px 4px rgba(49, 49, 49, 0.5)",
  margin: "1rem auto",
  transition: "background-color 0.3s ease",
  fontFamily: "'Prata', serif",
  maxWidth: "200px",
  "&:hover": {
    backgroundColor: "#868686",
  },
  "&:disabled": {
    backgroundColor: "#4a4a4a",
    color: "#8a8a8a",
    cursor: "not-allowed",
  },
});

const CloseButton = styled(IconButton)({
  position: "absolute",
  right: 8,
  top: 8,
  color: "white",
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

const ErrorList = styled(List)({
  color: "#ff6b6b",
  fontFamily: "'Prata', serif",
  fontSize: "14px",
  paddingLeft: "20px",
});

const ErrorListItem = styled(ListItem)({
  display: "list-item",
  listStyleType: "disc",
  padding: "4px 0",
});

const ConfirmationModal = ({
  isOpen,
  onClose,
  userId,
  eventDate,
  eventLocations,
}) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleValidationChange = (isValid) => {
    setIsFormValid(isValid);
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["first_name", "last_name", "phone", "email"];

    requiredFields.forEach((field) => {
      if (!formData.guest[field]) {
        errors[field] = `El campo "${getFieldName(field)}" es obligatorio.`;
      }
    });

    if (formData.hasPlusOne === "yes") {
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
  };

  const getFieldName = (field) => {
    const fieldNames = {
      first_name: "Nombre",
      last_name: "Apellido",
      phone: "Teléfono",
      email: "Email",
    };
    return fieldNames[field] || field;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

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
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormErrors({});
    onClose();
  };

  return (
    <CustomDialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <CloseButton onClick={handleClose} aria-label="close">
        <CloseIcon />
      </CloseButton>
      <ImageContainer>
        <StyledImage src={aguja} alt="Aguja" />
      </ImageContainer>
      <CustomDialogTitle>
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
      </CustomDialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        {isSubmitted ? (
          <CustomButton onClick={handleClose}>Cerrar</CustomButton>
        ) : (
          <CustomButton onClick={handleSubmit} disabled={!isFormValid}>
            Confirmar
          </CustomButton>
        )}
      </DialogActions>
    </CustomDialog>
  );
};

export default ConfirmationModal;
