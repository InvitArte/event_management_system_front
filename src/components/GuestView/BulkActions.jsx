import React, { useEffect } from "react";
import { Button, Box } from "@mui/material";
import { guestService } from "../../services/api";

const BulkActions = ({ selectedGuests, onBulkActionComplete }) => {
  const handleBulkValidate = async () => {
    try {
      const guestIds = selectedGuests.map((guest) => guest.id);
      await guestService.bulkValidate(guestIds);
      onBulkActionComplete();
    } catch (error) {
      console.error("Error validating guests in bulk:", error);
    }
  };

  useEffect(() => {}, [selectedGuests]);

  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBulkValidate}
        disabled={selectedGuests.length === 0}
      >
        Validar Seleccionados ({selectedGuests.length})
      </Button>
    </Box>
  );
};

export default BulkActions;
