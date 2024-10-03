import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import GuestTransferList from "./GuestTransferList";
import { tagService } from "../../../services/Api";
import CloseButton from "../../../components/Ui/CloseButton/CloseButton"; 

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const tagData = { name: tagName.trim() };
      const updatedSelectedGuests = selectedGuests.map((guest) => guest.id);

      let updatedTag;
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
        }
        if (nameChanged || assignmentsChanged) {
          onTagUpdate({
            ...tag,
            ...(updatedTag || {}),
            guests: updatedSelectedGuests,
          });
        }
      } else {
        // Modo de creación
        updatedTag = await tagService.createTag(tagData);
        if (updatedTag) {
          onTagUpdate({ ...updatedTag, guests: [] });
        } else {
          throw new Error("Error al crear la etiqueta");
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting tag:", error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setErrors({ general: error.response.data.message });
        }
      } else {
        setErrors({ general: "Failed to submit tag. Please try again." });
      }
      setError(error.message || "Error al enviar la etiqueta. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const areGuestAssignmentsSame = (tagId, newAssignments) => {
    const currentAssignments = guests
      .filter((guest) => guest.tags.some((tag) => tag.id === tagId))
      .map((guest) => guest.id);

    return (
      currentAssignments.length === newAssignments.length &&
      currentAssignments.every((id) => newAssignments.includes(id))
    );
  };

  const handleClose = () => {
    setTagName("");
    setSelectedGuests([]);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { overflow: 'visible' } }}>
      <DialogTitle sx={{ position: 'relative', paddingRight: '40px' }}>
        {tag ? "Editar Etiqueta" : "Crear Etiqueta"}
        <CloseButton onClose={handleClose} />
      </DialogTitle>
      <DialogContent>
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
        {errors.general && (
          <Typography color="error" align="center">
            {errors.general}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={isSubmitting || !tagName.trim()}
        >
          {tag ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
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