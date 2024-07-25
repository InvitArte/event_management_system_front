import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { guestService } from "../../services/api";
import GuestForm from "./GuestForm";

const GuestModal = ({
  open,
  onClose,
  guest,
  onSubmit,
  menus,
  allergies,
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
            allergy_id: formData.allergy_id,
            observations: formData.observations,
            accommodation_plan: formData.accommodation_plan,
          },
          plus_ones: formData.plus_ones.map((plusOne) => ({
            first_name: plusOne.first_name,
            last_name: plusOne.last_name,
            menu_id: plusOne.menu_id,
            allergy_id: plusOne.allergy_id,
            disability: plusOne.disability,
          })),
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <GuestForm
          guest={guest}
          onSubmit={handleSubmit}
          menus={menus}
          allergies={allergies}
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

export default GuestModal;
