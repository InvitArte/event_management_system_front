// React y hooks
import React, { useState, useEffect, useCallback } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  Box,
  Typography,
  TextField,
} from "@mui/material";

// Servicios
import { tagService } from "../../../services/Api";

// Componentes genéricos
import { ReusableModal } from "../../../components";

// Componentes propios
import GuestTransferList from "./GuestTransferList";

const TagModal = ({ open, onClose, onTagUpdate, tag, guests, setError }) => {
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tag) {
      const initialSelectedGuests = guests.filter((guest) =>
        guest.tags.some((guestTag) => guestTag.id === tag.id)
      );
      setSelectedGuests(initialSelectedGuests);
      setTagName(tag.name);
    } else {
      setSelectedGuests([]);
      setTagName("");
    }
    setErrors({});
  }, [tag, guests, open]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const tagData = { name: tagName.trim() };
      const updatedSelectedGuests = selectedGuests.map((guest) => guest.id);

      let updatedTag;
      let updatedGuests = [...guests];
      if (tag) {
        // Modo de edición
        const nameChanged = tagName !== tag.name;
        const assignmentsChanged = !areGuestAssignmentsSame(
          tag.id,
          updatedSelectedGuests
        );

        if (nameChanged) {
          updatedTag = await tagService.updateTag(tag.id, tagData);
        }
        if (assignmentsChanged) {
          await tagService.bulkAssign(tag.id, updatedSelectedGuests);
          updatedGuests = guests.map(guest => ({
            ...guest,
            tags: guest.tags.filter(t => t.id !== tag.id)
          }));
          updatedSelectedGuests.forEach(guestId => {
            const guestIndex = updatedGuests.findIndex(g => g.id === guestId);
            if (guestIndex !== -1) {
              updatedGuests[guestIndex] = {
                ...updatedGuests[guestIndex],
                tags: [...updatedGuests[guestIndex].tags, { id: tag.id, name: tagName }]
              };
            }
          });
        }
        if (nameChanged || assignmentsChanged) {
          onTagUpdate(
            {
              ...tag,
              ...(updatedTag || {}),
              name: tagName,
              guests: updatedSelectedGuests,
            },
            updatedGuests
          );
        }
      } else {
        // Modo de creación
        updatedTag = await tagService.createTag(tagData);
        if (updatedTag) {
          onTagUpdate({ ...updatedTag, guests: [] }, guests);
        } else {
          throw new Error("Error al crear la etiqueta");
        }
      }
      onClose();
    } catch (error) {
      console.error("Error submitting tag:", error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: "Fallo al crear la etiqueta, intentelo de nuevo." });
      }
      setError(error.message || "Error al enviar la etiqueta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [tag, tagName, selectedGuests, onTagUpdate, onClose, setError]);

  const areGuestAssignmentsSame = (tagId, newAssignments) => {
    const currentAssignments = guests
      .filter((guest) => guest.tags.some((tag) => tag.id === tagId))
      .map((guest) => guest.id);

    return (
      currentAssignments.length === newAssignments.length &&
      currentAssignments.every((id) => newAssignments.includes(id))
    );
  };

  const modalContent = (
    <>
      <Box mb={2}>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre de la etiqueta"
          type="text"
          fullWidth
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          error={!!errors.name}
          helperText={errors.name ? errors.name[0] : ""}
          required
        />
      </Box>
      {tag && (
        <>
          <Typography variant="h6" gutterBottom>
            Asignar a invitados
          </Typography>
          <GuestTransferList
            guests={guests}
            selectedGuests={selectedGuests}
            onSelectionChange={setSelectedGuests}
            tagId={tag.id}
          />
        </>
      )}
    </>
  );

  return (
    <ReusableModal
      open={open}
      onClose={onClose}
      title={tag ? "Editar Etiqueta" : "Crear Etiqueta"}
      onSubmit={handleSubmit}
      loading={isSubmitting}
      error={errors.general}
      submitButtonText={tag ? "Actualizar" : "Crear"}
      submitButtonDisabled={isSubmitting || !tagName.trim()}
      maxWidth="md"
    >
      {modalContent}
    </ReusableModal>
  );
};

TagModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTagUpdate: PropTypes.func.isRequired,
  tag: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    guests: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  }),
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  setError: PropTypes.func.isRequired,
};

export default TagModal;