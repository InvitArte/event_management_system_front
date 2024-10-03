import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useMediaQuery, useTheme, Box, Typography } from "@mui/material";
import CalendarButton from "./CalendarButton";
import ConfirmationModal from "./ConfirmationModal";
import GiftMessage from "./GiftMessage";
import CustomCard from "../../../components/Ui/CustomCard/CustomCard";
import EventTimeline from "./EventTimeline";
import FloralSeparator from "../../../assets/imgs/FloralSeparator.svg";
import IglesiaCarmen from "../../../assets/imgs/IglesiaCarmen.png";
import ConfirmButton from "./ConfirmButton";
import {
  CustomCardContent,
  EventTitle,
  EventSubtitle,
  EventInfo,
} from "./ConfirmationModalStyles";

/**
 * Componente CarmenEventCard
 * 
 * Este componente muestra la información detallada de un evento de boda,
 * incluyendo fecha, ubicaciones, timeline y botones de confirmación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.userId - ID del usuario
 * @param {boolean} props.showTitle - Indica si se debe mostrar el título
 * @param {string} props.svgSrc - Ruta de la imagen SVG
 * @param {Date} props.eventDate - Fecha del evento
 * @param {string} props.eventDateString - Fecha del evento en formato de cadena
 * @param {Array} props.eventLocations - Array de ubicaciones del evento
 */
const CarmenEventCard = ({
  userId,
  showTitle,
  svgSrc,
  eventDate,
  eventDateString,
  eventLocations,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const cardRef = useRef(null);
  const timelineRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Efecto para manejar el progreso del scroll en la línea de tiempo
   */
  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;
        const viewportBottom = windowHeight;

        if (timelineTop < viewportBottom) {
          const visibleHeight = Math.min(viewportBottom - timelineTop, timelineHeight);
          const progress = (visibleHeight / timelineHeight) * 100;
          setTimelineProgress(Math.min(100, Math.max(0, progress)));
        } else {
          setTimelineProgress(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Establecer el estado inicial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Manejador para abrir el modal de confirmación
   */
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  /**
   * Manejador para cerrar el modal de confirmación
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (!eventDate || !eventLocations) {
    return null;
  }

  /**
   * Componente para renderizar el separador floral
   */
  const FloralSeparatorComponent = () => (
    <Box
      component="img"
      src={FloralSeparator}
      alt="Separador Floral"
      sx={{
        width: "40px",
        height: "auto",
        display: "block",
        margin: "16px auto",
        opacity: 0.7,
      }}
    />
  );

  return (
    <CustomCard ref={cardRef}>
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          component="img"
          src={svgSrc}
          alt="Icono C"
          sx={getIconStyles(isMobile)}
        />
        <CustomCardContent>
          {renderTitle(showTitle)}
          <FloralSeparatorComponent />
          <ConfirmButton onClick={handleOpenModal} fullWidth={isMobile} />
          <FloralSeparatorComponent />
          {renderEventInfo(theme, eventDate, eventDateString, eventLocations)}
          <FloralSeparatorComponent />
          {renderChurchImage()}
          <FloralSeparatorComponent />
          {renderEventTimeline(timelineRef, timelineProgress, eventLocations)}
          <FloralSeparatorComponent />
          <GiftMessage accountNumber="ES16 2100  7761 2502 0006 3745" />
          <FloralSeparatorComponent />
          <ConfirmButton onClick={handleOpenModal} fullWidth={isMobile} />
        </CustomCardContent>
      </Box>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
      />
    </CustomCard>
  );
};

/**
 * Obtiene los estilos para el icono C
 * @param {boolean} isMobile - Indica si es dispositivo móvil
 * @returns {Object} Objeto de estilos
 */
const getIconStyles = (isMobile) => ({
  position: "absolute",
  top: isMobile ? "5px" : "10px",
  left: isMobile ? "5px" : "10px",
  width: isMobile ? "20vw" : "100px",
  height: isMobile ? "20vw" : "100px",
  maxWidth: isMobile ? "100px" : "none",
  maxHeight: isMobile ? "100px" : "none",
  zIndex: 1,
  opacity: 0.9,
});

/**
 * Renderiza el título del evento si showTitle es true
 * @param {boolean} showTitle - Indica si se debe mostrar el título
 * @returns {React.ReactNode}
 */
const renderTitle = (showTitle) => {
  if (!showTitle) return null;
  return (
    <>
      <EventSubtitle variant="h2">¡Nos casamos!</EventSubtitle>
      <EventTitle variant="h1">César y Carmen</EventTitle>
    </>
  );
};

/**
 * Renderiza la información del evento
 * @param {Object} theme - Tema de MUI
 * @param {Date} eventDate - Fecha del evento
 * @param {string} eventDateString - Fecha del evento en formato de cadena
 * @param {Array} eventLocations - Ubicaciones del evento
 * @returns {React.ReactNode}
 */
const renderEventInfo = (theme, eventDate, eventDateString, eventLocations) => (
  <EventInfo>
    <Typography
      variant="h6"
      gutterBottom
      align="center"
      sx={{
        fontFamily: "'Parisienne', cursive !important",
        fontSize: "1.5rem !important",
        color: theme.palette.primary.main,
      }}
    >
      Fecha y hora del evento
    </Typography>
    <Box display="flex" flexDirection="column" gap={2}>
      <CalendarButton
        eventDate={eventDate}
        eventDateString={eventDateString}
        eventLocations={eventLocations}
      />
    </Box>
  </EventInfo>
);

/**
 * Renderiza la imagen de la iglesia
 * @returns {React.ReactNode}
 */
const renderChurchImage = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mb: 4,
    }}
  >
    <img
      src={IglesiaCarmen}
      alt="Iglesia del Carmen"
      style={{
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  </Box>
);

/**
 * Renderiza la línea de tiempo del evento
 * @param {React.RefObject} timelineRef - Referencia al componente de línea de tiempo
 * @param {number} timelineProgress - Progreso actual de la línea de tiempo
 * @param {Array} eventLocations - Ubicaciones del evento
 * @returns {React.ReactNode}
 */
const renderEventTimeline = (timelineRef, timelineProgress, eventLocations) => (
  <EventInfo ref={timelineRef} sx={{ my: 8, minHeight: "60vh" }}>
    <EventTimeline
      scrollProgress={timelineProgress}
      eventLocations={eventLocations}
    />
  </EventInfo>
);

CarmenEventCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  showTitle: PropTypes.bool.isRequired,
  svgSrc: PropTypes.string.isRequired,
  eventDate: PropTypes.instanceOf(Date),
  eventDateString: PropTypes.string,
  eventLocations: PropTypes.array,
};

export default CarmenEventCard;