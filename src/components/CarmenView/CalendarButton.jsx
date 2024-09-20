import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  EventButton,
  TimeUnit,
  TimeValue,
  TimeLabel,
  EventDateTypography,
} from "./ConfirmationModalStyles";
import { Box } from "@mui/material";

const CalendarButton = ({ eventDate, eventDateString, eventLocations }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!eventDate) return null;
      const now = new Date();
      const difference = eventDate - now;
      if (difference <= 0) return {};
      return {
        días: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    };

    if (eventDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [eventDate]);

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
      "Boda de César y Carmen"
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      "Detalles del evento"
    )}&location=${encodeURIComponent(
      locationString || "Ubicación del evento"
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }, [eventDate, eventLocations]);

  if (!eventDate) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <EventDateTypography>{eventDateString}</EventDateTypography>
      {timeLeft && Object.keys(timeLeft).length > 0 ? (
        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          {Object.entries(timeLeft).map(([interval, value]) => (
            <TimeUnit key={interval}>
              <TimeValue>{value}</TimeValue>
              <TimeLabel>{interval}</TimeLabel>
            </TimeUnit>
          ))}
        </Box>
      ) : (
        <EventDateTypography>¡El gran día ha llegado!</EventDateTypography>
      )}
      <Box mt={2}>
        <EventButton onClick={addToGoogleCalendar}>
          Añadir a calendario
        </EventButton>
      </Box>
    </Box>
  );
};

CalendarButton.propTypes = {
  eventDate: PropTypes.instanceOf(Date),
  eventDateString: PropTypes.string.isRequired,
  eventLocations: PropTypes.arrayOf(
    PropTypes.shape({
      direccion: PropTypes.string,
    })
  ).isRequired,
};

export default CalendarButton;
