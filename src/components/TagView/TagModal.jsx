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

  useEffect(() => {
    if (tag) {
      // Filtramos los invitados que ya tienen esta etiqueta
      const initialSelectedGuests = guests.filter((guest) =>
        guest.tags.some((guestTag) => guestTag.id === tag.id)
      );
      setSelectedGuests(initialSelectedGuests);
    } else {
      setSelectedGuests([]);
    }
  }, [tag, guests]);

  const handleSubmit = async (tagData) => {
    await onSubmit(tagData, selectedGuests);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{tag ? "Editar Etiqueta" : "Crear Etiqueta"}</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TagForm tag={tag} onSubmit={handleSubmit} />
        </Box>
        <Typography variant="h6" gutterBottom>
          Asignar a invitados
        </Typography>
        <GuestTransferList
          guests={guests}
          selectedGuests={selectedGuests}
          onSelectionChange={setSelectedGuests}
          tagId={tag?.id}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => handleSubmit(tag || {})} color="primary">
          {tag ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagModal;
