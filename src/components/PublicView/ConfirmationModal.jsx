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
  padding: "0 40px 8px", // Ajustamos el padding para centrar mejor
  textAlign: "center",
  width: "100%", // Aseguramos que ocupe todo el ancho disponible
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
  padding: "0.5rem 1rem", // Reducimos el padding
  fontSize: "0.9rem", // Reducimos el tamaño de la fuente
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "2px 2px 4px rgba(49, 49, 49, 0.5)",
  margin: "1rem auto", // Centramos el botón
  transition: "background-color 0.3s ease",
  fontFamily: "'Prata', serif",
  maxWidth: "200px", // Limitamos el ancho máximo
  "&:hover": {
    backgroundColor: "#868686",
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

const ConfirmationModal = ({
  isOpen,
  onClose,
  userId,
  eventDate,
  eventLocations,
}) => {
  const [formData, setFormData] = useState(null);

  const handleFormChange = (data) => {
    setFormData(data);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const guestData = {
      ...formData.guest,
      user_id: userId,
    };

    const plusOneData =
      formData.hasPlusOne === "yes" ? formData.plus_one : null;

    try {
      const response = await publicService.createGuestWithPlusOne(
        guestData,
        plusOneData
      );
      console.log("Guest created:", response);
      onClose();
      // Aquí puedes añadir un mensaje de éxito o realizar otras acciones después de la creación exitosa
    } catch (error) {
      console.error("Error creating guest:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <CustomDialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <CloseButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </CloseButton>
      <ImageContainer>
        <StyledImage src={aguja} alt="Aguja" />
      </ImageContainer>
      <CustomDialogTitle>¿Te gustaría acompañarnos?</CustomDialogTitle>
      <CustomDialogContent>
        <ConfirmationForm onFormChange={handleFormChange} />
      </CustomDialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <CustomButton onClick={handleSubmit}>Confirmar</CustomButton>
      </DialogActions>
    </CustomDialog>
  );
};

export default ConfirmationModal;
