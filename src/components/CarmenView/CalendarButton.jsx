import React, { useCallback } from "react";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const CalendarButton = ({ eventDate, eventLocations }) => {
  const addToGoogleCalendar = useCallback(() => {
    if (!eventDate) return;

    const startDate =
      eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate =
      new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const locationString = eventLocations
      .map((location) => location.direccion)
      .join(", ");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Presentación Nueva Colección"
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      "Detalles del evento"
    )}&location=${encodeURIComponent(
      locationString || "Ubicación del evento"
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }, [eventDate, eventLocations]);

  if (!eventDate) return null;

  return (
    <Button
      variant="outlined"
      onClick={addToGoogleCalendar}
      sx={{ mb: 2, alignSelf: "center" }}
    >
      Añadir a calendario
    </Button>
  );
};

CalendarButton.propTypes = {
  eventDate: PropTypes.instanceOf(Date),
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      direccion: PropTypes.string,
    })
  ).isRequired,
};

export default CalendarButton;
