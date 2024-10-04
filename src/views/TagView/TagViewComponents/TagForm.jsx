// React y hooks
import React, { useState, useEffect } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
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

TagForm.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
};

export default TagForm;
