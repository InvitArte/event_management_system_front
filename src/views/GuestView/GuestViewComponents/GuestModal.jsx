// React y hooks
import React, { useState, useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
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
import { guestService } from "../../../services/Api";

// Componentes genericos
import {CloseButton} from "../../../components";

// Componentes propios
import GuestForm from "./GuestForm";

const GuestModal = ({
  open,
  onClose,
  guest,
  onSubmit,
  menus,
  allergies,
  tags,
  visibleFormFields,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (formData) => {
      setLoading(true);
      setError("");
      try {
        const guestData = {
          guest: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            email: formData.email,
            needs_transport: formData.needs_transport,
            needs_hotel: formData.needs_hotel,
            disability: formData.disability,
            menu_id: formData.menu_id,
            observations: formData.observations,
            accommodation_plan: formData.accommodation_plan,
          },
          allergies: formData.allergies, // Añadimos las alergias aquí
          plus_ones: formData.plus_ones.map((plusOne) => ({
            first_name: plusOne.first_name,
            last_name: plusOne.last_name,
            menu_id: plusOne.menu_id,
            disability: plusOne.disability,
            allergies: plusOne.allergies, // Añadimos las alergias para cada acompañante
          })),
          tags: formData.tags,
        };

        const response = guest
          ? await guestService.updateGuest(guest.id, guestData)
          : await guestService.createGuest(guestData);

        onSubmit();
        onClose();
      } catch (err) {
        console.error("Error submitting guest:", err);
        setError(handleErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [guest, onSubmit, onClose]
  );

  const handleErrorMessage = useCallback((err) => {
    if (err.response) {
      if (err.response.data && err.response.data.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("; ");
        return `Failed to save guest: ${errorMessages}`;
      } else if (err.response.data && err.response.data.message) {
        return `Failed to save guest: ${err.response.data.message}`;
      } else {
        return `Failed to save guest. Server responded with status ${err.response.status}`;
      }
    } else if (err.request) {
      return "Failed to save guest. No response received from server.";
    } else {
      return `Failed to save guest: ${err.message}`;
    }
  }, []);

  const modalTitle = useMemo(
    () => (guest ? "Editar Invitado" : "Crear Nuevo Invitado"),
    [guest]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          overflow: 'visible', // Permite que el botón se muestre fuera del modal
        },
      }}
    >
      <DialogTitle sx={{ position: 'relative', paddingRight: '40px' }}>
        {modalTitle}
        <CloseButton onClose={onClose} />
      </DialogTitle>
      <DialogContent>
        <GuestForm
            guest={{
              ...guest,
              plus_ones: guest?.plus_ones || []
            }}
          onSubmit={handleSubmit}
          menus={menus}
          allergies={allergies}
          tags={tags}
          visibleFormFields={visibleFormFields}
        />
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
          onClick={() => document.getElementById("guest-form-submit").click()}
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GuestModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  guest: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    needs_transport: PropTypes.bool,
    needs_hotel: PropTypes.bool,
    disability: PropTypes.bool,
    menu_id: PropTypes.number,
    allergy_id: PropTypes.number,
    observations: PropTypes.string,
    accommodation_plan: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.object),
    plus_ones: PropTypes.arrayOf(
      PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        menu_id: PropTypes.number,
        allergy_id: PropTypes.number,
        disability: PropTypes.bool,
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  allergies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleFormFields: PropTypes.shape({
    first_name: PropTypes.bool,
    last_name: PropTypes.bool,
    phone: PropTypes.bool,
    email: PropTypes.bool,
    needs_transport: PropTypes.bool,
    needs_hotel: PropTypes.bool,
    disability: PropTypes.bool,
    menu: PropTypes.bool,
    allergy: PropTypes.bool,
    observations: PropTypes.bool,
    accommodation_plan: PropTypes.bool,
    tags: PropTypes.bool,
    plus_ones: PropTypes.bool,
  }).isRequired,
};

export default GuestModal;