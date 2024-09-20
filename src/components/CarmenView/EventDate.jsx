import React from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDateTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.2rem",
  fontWeight: 500,
  color: theme.palette.primary.main,
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const EventDate = ({ eventDateString }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <StyledDateTypography variant="h6">
      {eventDateString || "Fecha no disponible"}
    </StyledDateTypography>
  </Box>
);

EventDate.propTypes = {
  eventDateString: PropTypes.string.isRequired,
};

export default EventDate;
