import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import TagForm from "./TagForm";
import GuestTransferList from "./GuestTransferList";

const TagModal = ({ open, onClose, onSubmit, tag, guests }) => {
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [tagName, setTagName] = useState("");

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
  }, [tag, guests]);

  const handleSubmit = async () => {
    const tagData = { name: tagName };
    const updatedSelectedGuests = selectedGuests.map((guest) => guest.id);

    if (tag) {
      // Modo de edición
      const nameChanged = tagName !== tag.name;
      const assignmentsChanged = !areGuestAssignmentsSame(
        tag.id,
        updatedSelectedGuests
      );

      if (nameChanged || assignmentsChanged) {
        await onSubmit(
          tag.id,
          tagData,
          updatedSelectedGuests,
          nameChanged,
          assignmentsChanged
        );
      }
    } else {
      // Modo de creación
      await onSubmit(null, tagData, updatedSelectedGuests, true, false);
    }
    onClose();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{tag ? "Editar Etiqueta" : "Crear Etiqueta"}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TagForm
            tag={{ name: tagName }}
            onSubmit={({ name }) => setTagName(name)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} color="primary">
          {tag ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagModal;
