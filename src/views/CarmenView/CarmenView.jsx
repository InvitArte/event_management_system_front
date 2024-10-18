import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";
import { LoadingComponent } from "../../components";
import { CarmenHeader, CarmenEventCard, ConfirmationModal } from "./CarmenViewComponents";
import { publicService } from "../../services/Api";
import Prueba from "../../assets/imgs/prueba_amapolas.png";
import MobileBackground from "../../assets/imgs/mobile_fondo.png";
import CSvg from "../../assets/imgs/CC.svg";

const CarmenView = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const parseEventDate = (dateString) => {
    const [year, month, day, hour, minute] = dateString.split(" ").map(Number);
    const parsedDate = new Date(year, month - 1, day, hour, minute);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

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

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (!userId) {
    console.error("CarmenView: userId es indefinido o nulo");
    return <div>Error: No se pudo cargar la información del usuario.</div>;
  }

  const renderContent = () => {
    if (error) {
      return (
        <Box sx={{ color: "error.main", textAlign: "center", p: 2 }}>
          {error}
        </Box>
      );
    }

    if (!eventData) {
      return null;
    }

    return (
      <CarmenEventCard
        userId={userId}
        showTitle={false}
        svgSrc={CSvg}
        eventDate={eventData.eventDate}
        eventDateString={eventData.eventDateString}
        eventLocations={eventData.eventLocations}
        onOpenModal={handleOpenModal}
        useCardStyles={false}
      />
    );
  };

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <Box sx={getBackgroundStyles(isMobile)} />
      <Box sx={getContentWrapperStyles()}>
        <LoadingComponent isLoading={isLoading} type="svg" />
        <Box sx={getHeaderContainerStyles(isMobile)}>
          <CarmenHeader onOpenModal={handleOpenModal} />
        </Box>
        <Box sx={getContentStyles(isMobile)}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              {renderContent()}
            </Grid>
          </Grid>
        </Box>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
        />
      </Box>
    </Box>
  );
};

const getContainerStyles = (isMobile) => ({
  width: "100%",
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
});

const getBackgroundStyles = (isMobile) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url(${isMobile ? MobileBackground : Prueba})`,
  backgroundSize: isMobile ? "120%" : "cover",
  backgroundPosition: isMobile ? "center top" : "center center",
  backgroundRepeat: "no-repeat",
  transform: isMobile ? "none" : "scale(1)",
  transition: "transform 0.3s ease-out",
  zIndex: -1,
});

const getContentWrapperStyles = () => ({
  position: "relative",
  zIndex: 1,
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

const getHeaderContainerStyles = (isMobile) => ({
  width: "100%",
  padding: isMobile ? "20px" : "40px",
  boxSizing: "border-box",
});

const getContentStyles = (isMobile) => ({
  flexGrow: 1,
  display: "flex",
  alignItems: "flex-start",
  py: isMobile ? 3 : 2,
  px: isMobile ? 2 : 4,
  mt: isMobile ? 2 : 4,
});

CarmenView.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CarmenView;