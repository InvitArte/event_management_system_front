// React y hooks
import React, { useState, useEffect, useCallback } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";

// Componentes propios
import { LoadingComponent } from "../../components";
import { CarmenHeader, CarmenEventCard } from "./CarmenViewComponents";

// Servicios
import { publicService } from "../../services/Api";

// Imágenes y assets
import Azulejo from "../../assets/imgs/Azulejo1.jpeg";
import CSvg from "../../assets/imgs/CC.svg";

/**
 * Componente CarmenView
 *
 * Este componente muestra información de eventos para un usuario específico.
 * Obtiene datos del evento, incluyendo fecha y ubicaciones, y los renderiza en formato de tarjeta.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.userId - El ID del usuario para el que se obtendrán los datos del evento
 */
const CarmenView = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Obtiene los datos del evento desde la API
   */
  const fetchEventData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dateResponse, locationsResponse] = await Promise.all([
        publicService.getUserDate(userId),
        publicService.getPublicLocations(userId),
      ]);

      const processedEventData = processEventData(dateResponse, locationsResponse);
      setEventData(processedEventData);
    } catch (error) {
      console.error("Error al obtener los datos del evento:", error);
      setError("No se pudieron cargar los datos del evento. Por favor, intente nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Procesa los datos brutos del evento obtenidos de la API
   *
   * @param {Object} dateResponse - Respuesta que contiene la fecha del evento
   * @param {Object} locationsResponse - Respuesta que contiene las ubicaciones del evento
   * @returns {Object} Datos del evento procesados
   */
  const processEventData = (dateResponse, locationsResponse) => {
    let eventDate = null;
    let eventDateString = "";

    if (dateResponse && dateResponse.date) {
      eventDate = parseEventDate(dateResponse.date);
      eventDateString = formatEventDate(eventDate);
    }

    const eventLocations = Array.isArray(locationsResponse) ? locationsResponse : [];

    return { eventDate, eventDateString, eventLocations };
  };

  /**
   * Analiza la cadena de fecha del evento y la convierte en un objeto Date
   *
   * @param {string} dateString - Cadena de fecha de la API
   * @returns {Date|null} Objeto Date analizado o null si es inválido
   */
  const parseEventDate = (dateString) => {
    const [year, month, day, hour, minute] = dateString.split(" ").map(Number);
    const parsedDate = new Date(year, month - 1, day, hour, minute);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  /**
   * Formatea la fecha del evento para su visualización
   *
   * @param {Date} date - La fecha del evento
   * @returns {string} Cadena de fecha formateada
   */
  const formatEventDate = (date) => {
    if (!date) return "";
    const formattedDate = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}h`;
  };

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (!userId) {
    console.error("CarmenView: userId es indefinido o nulo");
    return <div>Error: No se pudo cargar la información del usuario.</div>;
  }

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <LoadingComponent isLoading={isLoading} type="svg" />
      <CarmenHeader showTitle={isMobile} />
      <Box sx={getContentStyles(isMobile)}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            {renderContent(error, eventData, userId, isMobile)}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

/**
 * Obtiene los estilos para el contenedor principal
 *
 * @param {boolean} isMobile - Indica si el dispositivo es móvil
 * @returns {Object} Objeto de estilos para el contenedor
 */
const getContainerStyles = (isMobile) => ({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  backgroundImage: `url(${Azulejo})`,
  backgroundSize: isMobile ? "200%" : "cover",
  backgroundPosition: isMobile ? "center top" : "center",
  backgroundRepeat: "repeat",
  backgroundAttachment: isMobile ? "scroll" : "fixed",
});

/**
 * Obtiene los estilos para el área de contenido
 *
 * @param {boolean} isMobile - Indica si el dispositivo es móvil
 * @returns {Object} Objeto de estilos para el área de contenido
 */
const getContentStyles = (isMobile) => ({
  flexGrow: 1,
  display: "flex",
  alignItems: "flex-start",
  py: isMobile ? 3 : 2,
  px: isMobile ? 2 : 4,
  mt: 0,
});

/**
 * Renderiza el contenido principal del componente
 *
 * @param {string|null} error - Mensaje de error, si lo hay
 * @param {Object|null} eventData - Datos del evento procesados
 * @param {string|number} userId - El ID del usuario
 * @param {boolean} isMobile - Indica si el dispositivo es móvil
 * @returns {React.ReactNode} El contenido renderizado
 */
const renderContent = (error, eventData, userId, isMobile) => {
  if (error) {
    return (
      <Box sx={{ color: "error.main", textAlign: "center", p: 2 }}>
        {error}
      </Box>
    );
  }

  return (
    <CarmenEventCard
      userId={userId}
      showTitle={!isMobile}
      svgSrc={CSvg}
      eventDate={eventData?.eventDate}
      eventDateString={eventData?.eventDateString}
      eventLocations={eventData?.eventLocations}
    />
  );
};

CarmenView.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CarmenView;