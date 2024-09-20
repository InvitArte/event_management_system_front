import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, Link } from "@mui/material";
import { EventButton, EventInfo } from "./ConfirmationModalStyles";

const EventLocations = ({ eventLocations }) => {
  if (!eventLocations || eventLocations.length === 0) return null;

  return (
    <EventInfo>
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ fontFamily: "'Parisienne', regular", fontSize: "1.5rem" }}
      >
        {eventLocations.length > 1 ? "Ubicaciones:" : "Ubicación:"}
      </Typography>
      {eventLocations.map((location, index) => (
        <Box key={location.id || index} sx={{ mb: 2, textAlign: "center" }}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ fontFamily: "'Prata', serif", fontSize: "1rem" }}
          >
            {location.direccion || location.name}
          </Typography>
          {location.url && (
            <Link
              href={location.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <EventButton variant="outlined" size="small">
                Cómo llegar
              </EventButton>
            </Link>
          )}
        </Box>
      ))}
    </EventInfo>
  );
};

EventLocations.propTypes = {
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      direccion: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};

export default EventLocations;
