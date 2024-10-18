// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Grid, Box, useMediaQuery, useTheme } from "@mui/material";

// hooks y servicios
import {useCarmenView} from "../../hooks";

// Componentes genericos
import { LoadingComponent } from "../../components";

// Componentes propios
import { CarmenHeader, CarmenEventCard, ConfirmationModal } from "./CarmenViewComponents";

// Assets y estilos
import Prueba from "../../assets/imgs/prueba_amapolas.png";
import MobileBackground from "../../assets/imgs/mobile_fondo.png";
import CSvg from "../../assets/imgs/CC.svg";

const CarmenView = ({ userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    isLoading,
    eventData,
    error,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  } = useCarmenView(userId);

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