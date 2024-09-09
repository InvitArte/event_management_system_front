import React, { useCallback } from "react";
import { Typography, Button, Box } from "@mui/material";
import PropTypes from "prop-types";

const EventLocations = ({ eventLocations }) => {
  const openGoogleMaps = useCallback((url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      console.error("No URL provided for this location");
    }
  }, []);

  if (eventLocations.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" align="center">
        {eventLocations.length > 1 ? "Ubicaciones:" : "Ubicación:"}
      </Typography>
      {eventLocations.map((location) => (
        <Box key={location.id} sx={{ mb: 1, textAlign: "center" }}>
          <Typography>{location.name}</Typography>
          <Button
            variant="outlined"
            onClick={() => openGoogleMaps(location.url)}
          >
            Cómo llegar
          </Button>
        </Box>
      ))}
    </Box>
  );
};

EventLocations.propTypes = {
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default EventLocations;
