import React from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const EventDate = ({ eventDateString }) => (
  <Typography variant="body1" gutterBottom align="center">
    Fecha: {eventDateString || "Fecha no disponible"}
  </Typography>
);

EventDate.propTypes = {
  eventDateString: PropTypes.string.isRequired,
};

export default EventDate;
