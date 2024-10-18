// React y hooks
import React, { useState, useEffect, useCallback, useRef } from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import { useMediaQuery, useTheme, Box, Typography } from "@mui/material";

// Componentes genéricos
import { CustomCard } from "../../../components";

// Componentes propios
import {
  CalendarButton,
  ConfirmationModal,
  GiftMessage,
  EventTimeline,
  ConfirmButton,
  EventTitleStyle,
  EventSubtitle,
  EventInfo
} from './index';


// Assets y estilos
import FloralSeparator from "../../../assets/imgs/FloralSeparator.svg";
import IglesiaCarmen from "../../../assets/imgs/IglesiaCarmen.png";

const CarmenEventCard = ({
  userId,
  showTitle,
  eventDate,
  eventDateString,
  eventLocations,
  useCardStyles = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const cardRef = useRef(null);
  const timelineRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (!eventDate || !eventLocations) {
    return null;
  }

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

  const renderTitle = () => {
    if (!showTitle) return null;
    return (
      <>
        <EventSubtitle variant="h2">¡Nos casamos!</EventSubtitle>
        <EventTitleStyle variant="h1">César y Carmen</EventTitleStyle>
      </>
    );
  };

  const renderEventInfo = () => (
    <EventInfo>
       <Typography
        variant="h6"
        gutterBottom
        align="center"
        sx={{
          fontFamily: "'CormorantUpright', regular !important",
          fontSize: isMobile ? "1.5rem !important" : "2.5rem !important",
          color: "#8D5444",
          whiteSpace: isMobile ? "nowrap" : "normal",
          overflow: isMobile ? "hidden" : "visible",
          textOverflow: isMobile ? "ellipsis" : "clip",
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

  const renderEventTimeline = () => (
    <EventInfo ref={timelineRef} sx={{ my: 8, minHeight: "60vh" }}>
      <EventTimeline
        scrollProgress={timelineProgress}
        eventLocations={eventLocations}
      />
    </EventInfo>
  );

  return (
    <CustomCard ref={cardRef} useCardStyles={useCardStyles}>
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box sx={{ padding: useCardStyles ? 2 : 0 }}>
          {renderTitle()}
          <FloralSeparatorComponent />
          {renderEventInfo()}
          <FloralSeparatorComponent />
          {renderEventTimeline()}
          <FloralSeparatorComponent />
          <GiftMessage accountNumber="DE01 2345 6789 0123 4567 8901" />
          <FloralSeparatorComponent />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ConfirmButton onClick={handleOpenModal} fullWidth={isMobile} />
          </Box>
        </Box>
      </Box>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
      />
    </CustomCard>
  );
};

CarmenEventCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  showTitle: PropTypes.bool.isRequired,
  svgSrc: PropTypes.string.isRequired,
  eventDate: PropTypes.instanceOf(Date),
  eventDateString: PropTypes.string,
  eventLocations: PropTypes.array,
  useCardStyles: PropTypes.bool,
};


export default CarmenEventCard;