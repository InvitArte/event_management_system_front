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

/**
 * Componente CalendarButton
 * 
 * Este componente muestra la fecha del evento, una cuenta regresiva y un botón
 * para añadir el evento al calendario de Google.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Date} props.eventDate - Fecha y hora del evento
 * @param {string} props.eventDateString - Fecha del evento formateada como string
 * @param {Array} props.eventLocations - Array de ubicaciones del evento
 */
const CalendarButton = ({ eventDate, eventDateString, eventLocations }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  /**
   * Efecto para calcular y actualizar el tiempo restante hasta el evento
   */
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

  /**
   * Función para añadir el evento al calendario de Google
   */
  const addToGoogleCalendar = useCallback(() => {
    if (!eventDate) return;

    const startDate = formatDateForCalendar(eventDate);
    const endDate = formatDateForCalendar(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000));
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
      {renderCountdown(timeLeft)}
      <Box mt={2}>
        <EventButton onClick={addToGoogleCalendar}>
          Añadir a calendario
        </EventButton>
      </Box>
    </Box>
  );
};

/**
 * Formatea una fecha para su uso en la URL del calendario de Google
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDateForCalendar = (date) =>
  date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

/**
 * Renderiza la cuenta regresiva o un mensaje si el evento ya ha pasado
 * @param {Object|null} timeLeft - Objeto con el tiempo restante
 * @returns {React.ReactNode}
 */
const renderCountdown = (timeLeft) => {
  if (timeLeft && Object.keys(timeLeft).length > 0) {
    return (
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        {Object.entries(timeLeft).map(([interval, value]) => (
          <TimeUnit key={interval}>
            <TimeValue>{value}</TimeValue>
            <TimeLabel>{interval}</TimeLabel>
          </TimeUnit>
        ))}
      </Box>
    );
  } else {
    return <EventDateTypography>¡El gran día ha llegado!</EventDateTypography>;
  }
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