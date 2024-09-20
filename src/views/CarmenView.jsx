import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";
import Azulejo from "../assets/imgs/Azulejo1.jpeg";
import CarmenHeader from "../components/CarmenView/CarmenHeader";
import CarmenEventCard from "../components/CarmenView/CarmenEventCard";
import CSvg from "../assets/imgs/CC.svg";
import LoadingComponent from "../components/Ui/LoadingComponent";
import { publicService } from "../services/Api";

const CarmenView = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);

  const fetchEventData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dateResponse, locationsResponse] = await Promise.all([
        publicService.getUserDate(userId),
        publicService.getPublicLocations(userId),
      ]);

      let eventDate = null;
      let eventDateString = "";
      if (dateResponse && dateResponse.date) {
        const dateString = dateResponse.date;
        const [year, month, day, hour, minute] = dateString
          .split(" ")
          .map(Number);
        eventDate = new Date(year, month - 1, day, hour, minute);
        if (!isNaN(eventDate.getTime())) {
          const formattedDate = eventDate.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const formattedTime = eventDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          });
          eventDateString = `${formattedDate} - ${formattedTime}h`;
        }
      }

      const eventLocations =
        locationsResponse && Array.isArray(locationsResponse)
          ? locationsResponse
          : [];

      setEventData({ eventDate, eventDateString, eventLocations });
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(
        "No se pudieron cargar los datos del evento. Por favor, intente nuevamente más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (!userId) {
    console.error("CarmenView: userId is undefined or null");
    return <div>Error: No se pudo cargar la información del usuario.</div>;
  }

  return (
    <Box
      sx={{
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
      }}
    >
      <LoadingComponent isLoading={isLoading} type="svg" />

      <CarmenHeader showTitle={isMobile} />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          py: isMobile ? 3 : 2,
          px: isMobile ? 2 : 4,
          mt: 0,
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            {error ? (
              <Box sx={{ color: "error.main", textAlign: "center", p: 2 }}>
                {error}
              </Box>
            ) : (
              <CarmenEventCard
                userId={userId}
                showTitle={!isMobile}
                svgSrc={CSvg}
                eventDate={eventData?.eventDate}
                eventDateString={eventData?.eventDateString}
                eventLocations={eventData?.eventLocations}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

CarmenView.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default CarmenView;
