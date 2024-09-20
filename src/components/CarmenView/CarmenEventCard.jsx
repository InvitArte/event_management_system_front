import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useMediaQuery, useTheme, Box, Typography } from "@mui/material";
import CountdownTimer from "./CountdownTimer";
import EventDate from "./EventDate";
import CalendarButton from "./CalendarButton";
import EventLocations from "./EventLocations";
import ConfirmationModal from "./ConfirmationModal";
import GiftMessage from "./GiftMessage";
import CustomCard from "../Ui/CustomCard";
import EventTimeline from "./EventTimeline";
import FloralSeparator from "../../assets/imgs/FloralSeparator.svg";
import ConfirmButton from "./ConfirmButton";
import {
  CustomCardContent,
  EventTitle,
  EventSubtitle,
  EventInfo,
} from "./ConfirmationModalStyles";

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

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        const timelineStart = scrollTop + timelineRect.top;
        const timelineEnd = timelineStart + timelineRect.height;

        const scrollProgress =
          (scrollTop + windowHeight - timelineStart) /
          (timelineEnd - timelineStart);

        const clampedProgress = Math.max(
          0,
          Math.min(100, scrollProgress * 100)
        );

        setTimelineProgress(clampedProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
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
      alt="Floral Separator"
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
          alt="C icon"
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: isMobile ? "30vw" : "100px",
            height: isMobile ? "30vw" : "100px",
            maxWidth: isMobile ? "150px" : "none",
            maxHeight: isMobile ? "150px" : "none",
            zIndex: 1,
            opacity: 0.9,
          }}
        />
        <CustomCardContent>
          {showTitle && (
            <>
              <EventSubtitle variant="h2">¡Nos casamos!</EventSubtitle>
              <EventTitle variant="h1">César y Carmen</EventTitle>
            </>
          )}

          <FloralSeparatorComponent />
          <ConfirmButton onClick={handleOpenModal} fullWidth={isMobile} />
          <FloralSeparatorComponent />
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

          <FloralSeparatorComponent />

          <EventInfo ref={timelineRef} sx={{ my: 8, minHeight: "60vh" }}>
            <EventTimeline
              scrollProgress={timelineProgress}
              eventLocations={eventLocations}
            />
          </EventInfo>

          <FloralSeparatorComponent />

          <GiftMessage accountNumber="ES12 3456 7890 1234 5678 9012" />

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

CarmenEventCard.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  showTitle: PropTypes.bool.isRequired,
  svgSrc: PropTypes.string.isRequired,
  eventDate: PropTypes.instanceOf(Date),
  eventDateString: PropTypes.string,
  eventLocations: PropTypes.array,
};

export default CarmenEventCard;
