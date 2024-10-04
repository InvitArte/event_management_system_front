//Rect y hooks
import React, { useCallback } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Button, Box } from "@mui/material";

// Servicios
import { guestService } from "../../../services/Api";

const BulkActions = ({
  selectedGuests,
  onBulkActionComplete,
  onSelectionReset,
}) => {
  const handleBulkValidate = useCallback(async () => {
    try {
      const guestIds = selectedGuests.map((guest) => guest.id);
      await guestService.bulkValidate(guestIds);
      onBulkActionComplete();
      onSelectionReset(); // Reseteamos la selección después de completar la acción
    } catch (error) {
      console.error("Error validating guests in bulk:", error);
    }
  }, [selectedGuests, onBulkActionComplete, onSelectionReset]);

  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBulkValidate}
        disabled={selectedGuests.length === 0}
      >
        Verificar Seleccionados ({selectedGuests.length})
      </Button>
    </Box>
  );
};

BulkActions.propTypes = {
  selectedGuests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  onBulkActionComplete: PropTypes.func.isRequired,
  onSelectionReset: PropTypes.func.isRequired,
};

export default BulkActions;
