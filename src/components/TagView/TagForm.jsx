import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

const TagForm = ({ tag, onSubmit }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    } else {
      setName("");
    }
  }, [tag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        autoFocus
        margin="dense"
        label="Nombre de la etiqueta"
        type="text"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button type="submit" color="primary">
          {tag ? "Actualizar" : "Crear"}
        </Button>
      </Box>
    </form>
  );
};

export default TagForm;
