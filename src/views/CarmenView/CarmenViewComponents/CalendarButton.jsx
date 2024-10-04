// React y hooks
import React, { useCallback, useEffect, useState } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, useMediaQuery, useTheme } from "@mui/material";

// Componentes y estilos propios
import {
  EventButton,
  TimeUnit,
  TimeValue,
  TimeLabel,
  EventDateTypography,
} from "./ConfirmationModalStyles";

/**
 * Componente CalendarButton
 *
 * Este componente muestra una cuenta regresiva para un evento, la fecha del evento,
 * y un botón para añadir el evento al calendario de Google. Se adapta a dispositivos
 * móviles y de escritorio, usa singular o plural según corresponda, y muestra meses
 * cuando el tiempo restante es superior a 30 días.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Date} props.eventDate - Fecha y hora del evento
 * @param {string} props.eventDateString - Fecha del evento formateada como string
 * @param {Array<{direccion: string}>} props.eventLocations - Array de ubicaciones del evento
 */
const CalendarButton = ({ eventDate, eventDateString, eventLocations }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    /**
     * Calcula el tiempo restante hasta el evento
     * @returns {Object|null} Objeto con el tiempo restante o null si no hay fecha de evento
     */
    const calculateTimeLeft = () => {
      if (!eventDate) return null;
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) return {};

      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
      const daysInMilliseconds = difference - (months * 30.44 * 24 * 60 * 60 * 1000);
      const days = Math.floor(daysInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { meses: months, días: days, horas: hours, minutos: minutes, segundos: seconds };
    };

    if (eventDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [eventDate]);

  /**
   * Añade el evento al calendario de Google
   */
  const addToGoogleCalendar = useCallback(() => {
    if (!eventDate) return;
    const startDate = formatDateForCalendar(eventDate);
    const endDate = formatDateForCalendar(new Date(eventDate.getTime() + 2 * 60 * 60 * 1000));
    const locationString = eventLocations.map((location) => location.direccion).join(", ");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Boda de César y Carmen"
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      "Detalles del evento"
    )}&location=${encodeURIComponent(locationString || "Ubicación del evento")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [eventDate, eventLocations]);

  if (!eventDate) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <EventDateTypography>{eventDateString}</EventDateTypography>
      {renderCountdown(timeLeft, isMobile)}
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
 * @param {boolean} isMobile - Indica si se está renderizando en un dispositivo móvil
 * @returns {React.ReactNode}
 */
const renderCountdown = (timeLeft, isMobile) => {
  if (timeLeft && Object.keys(timeLeft).length > 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={isMobile ? 0.5 : 1}
        mb={3}
        flexWrap="nowrap"
        sx={{
          fontSize: isMobile ? '0.8rem' : '1rem',
          '& > *': { flexShrink: 0 }
        }}
      >
        {Object.entries(timeLeft).map(([interval, value]) => {
          if (value > 0) {
            const label = value === 1 ? singularLabels[interval] : interval;
            return (
              <TimeUnit key={interval} sx={{ padding: isMobile ? '4px' : '8px' }}>
                <TimeValue sx={{ fontSize: isMobile ? '2.10rem' : '2.8rem' }}>{value}</TimeValue>
                <TimeLabel sx={{ fontSize: isMobile ? '1rem' : '1.8rem' }}>{label}</TimeLabel>
              </TimeUnit>
            );
          }
          return null;
        })}
      </Box>
    );
  } else {
    return <EventDateTypography>¡El gran día ha llegado!</EventDateTypography>;
  }
};

/**
 * Objeto que contiene las etiquetas en singular para cada unidad de tiempo
 */
const singularLabels = {
  meses: 'mes',
  días: 'día',
  horas: 'hora',
  minutos: 'minuto',
  segundos: 'segundo'
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