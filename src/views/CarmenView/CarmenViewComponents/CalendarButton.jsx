// React y hooks
import React, { useCallback, useEffect, useState } from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, useMediaQuery, useTheme } from "@mui/material";

// Servicios y configuración
import { IS_DEMO } from "../../../config/api/BaseUrl";

// Componentes genéricos
import { formatDateForCalendar, formatDateToString } from "../../../components";

// Assets y estilos
import {
  TimeUnit,
  TimeValue,
  TimeLabel,
  EventDateTypography,
  ElegantButton,
} from "./ConfirmationModalStyles";

const CalendarButton = ({ eventDate, eventDateString, eventLocations }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [displayDate, setDisplayDate] = useState(eventDate);
  const [displayDateString, setDisplayDateString] = useState(eventDateString);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const now = new Date();
    if (IS_DEMO && eventDate < now) {
      const newDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate() + 4);
      setDisplayDate(newDate);
      setDisplayDateString(formatDateToString(newDate));
    } else {
      setDisplayDate(eventDate);
      setDisplayDateString(eventDateString);
    }
  }, [eventDate, eventDateString]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!displayDate) return null;
      const now = new Date();
      const difference = displayDate.getTime() - now.getTime();

      if (difference <= 0) return {};

      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
      const daysInMilliseconds = difference - (months * 30.44 * 24 * 60 * 60 * 1000);
      const days = Math.floor(daysInMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { meses: months, días: days, horas: hours, minutos: minutes, segundos: seconds };
    };

    if (displayDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [displayDate]);

  const addToGoogleCalendar = useCallback(() => {
    if (!displayDate) return;
    const startDate = formatDateForCalendar(displayDate);
    const endDate = formatDateForCalendar(new Date(displayDate.getTime() + 2 * 60 * 60 * 1000));
    const locationString = eventLocations.map((location) => location.direccion).join(", ");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "Tu celebración"
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      "Detalles del evento"
    )}&location=${encodeURIComponent(locationString || "Ubicación del evento")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [displayDate, eventLocations]);

  if (!displayDate) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: 'transparent',
        color: theme.palette.text.primary,
      }}
    >
        <EventDateTypography sx={{
        color: 'inherit',
        mb: 2,
        fontSize: isMobile ? "1.2rem" : "1.7rem"
      }}>
        {displayDateString}
      </EventDateTypography>
      {renderCountdown(timeLeft, isMobile, theme)}
      <Box mt={2}>
        <ElegantButton inverted="true"
          onClick={addToGoogleCalendar}
        >
          Añadir a calendario
        </ElegantButton>
      </Box>
    </Box>
  );
};

const renderCountdown = (timeLeft, isMobile, theme) => {
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
              <TimeUnit key={interval} sx={{ padding: isMobile ? '4px' : '8px', background: 'transparent' }}>
                <TimeValue sx={{ fontSize: isMobile ? '2.10rem' : '2.8rem', color: 'inherit' }}>{value}</TimeValue>
                <TimeLabel sx={{ fontSize: isMobile ? '1rem' : '1.8rem', color: 'inherit' }}>{label}</TimeLabel>
              </TimeUnit>
            );
          }
          return null;
        })}
      </Box>
    );
  } else {
    return <EventDateTypography sx={{ color: 'inherit' }}>¡El gran día ha llegado!</EventDateTypography>;
  }
};

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