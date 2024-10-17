// React y hooks
import React, { useState, useCallback, useMemo, useEffect } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box } from "@mui/material";

// Servicios
import { guestService } from "../../../services/Api";

// Componentes genéricos
import {ReusableModal} from "../../../components";

// Componentes propios
import GuestForm from "./GuestForm";

const GuestModal = ({
  open,
  onClose,
  guest,
  onSubmit,
  menus,
  allAllergies,
  allTags,
  visibleFormFields,
  onOpenTagModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localGuest, setLocalGuest] = useState(null);

  useEffect(() => {
    if (open) {
      if (guest) {
        setLocalGuest({
          ...guest,
          plus_ones: guest.plus_ones || [],
        });
      } else {
        setLocalGuest({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          needs_transport: false,
          needs_transport_back: false,
          needs_hotel: false,
          disability: false,
          menu_id: null,
          observations: "",
          accommodation_plan: "",
          plus_ones: [],
          tags: [],
          allergies: [],
        });
      }
    } else {
      setLocalGuest(null);
    }
  }, [open, guest]);

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
            needs_transport_back: formData.needs_transport_back,
            needs_hotel: formData.needs_hotel,
            disability: formData.disability,
            menu_id: formData.menu_id,
            observations: formData.observations,
            accommodation_plan: formData.accommodation_plan,
          },
          allergies: formData.allergies,
          plus_ones: formData.plus_ones.map((plusOne) => ({
            first_name: plusOne.first_name,
            last_name: plusOne.last_name,
            menu_id: plusOne.menu_id,
            disability: plusOne.disability,
            allergies: plusOne.allergies,
          })),
          tags: formData.tags,
        };

        const response = guest
          ? await guestService.updateGuest(guest.id, guestData)
          : await guestService.createGuest(guestData);

        onSubmit(response);
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

  const modalContent = (
    <>
      {localGuest ? (
        <GuestForm
          guest={localGuest}
          onSubmit={handleSubmit}
          menus={menus}
          allergies={allAllergies}
          tags={allTags}
          visibleFormFields={visibleFormFields}
          onOpenTagModal={onOpenTagModal}
        />
      ) : (
        <Box sx={{ textAlign: 'center', py: 2 }}>Cargando...</Box>
      )}
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      onSubmit={() => document.getElementById("guest-form-submit").click()}
      loading={loading}
      error={error}
      maxWidth="md"
      fullWidth
    >
      {modalContent}
    </ReusableModal>
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
  allAllergies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  allTags: PropTypes.arrayOf(
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
  onOpenTagModal: PropTypes.func.isRequired,
};

export default GuestModal;