import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import EventLocations from "./EventLocations";
import {
  CustomDialogTitle,
  CustomDialogContent,
  CloseButton,
  EventButton,
  mainBlue,
  TimelineEventTitle,
  TimelineEventDescription,
} from "./ConfirmationModalStyles";

const TimelineItem = ({
  icon,
  time,
  description,
  fillPercentage,
  isLast,
  locations,
  isExpandable,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
        mb: isLast ? 0 : 8,
        height: "auto",
        minHeight: isMobile ? "15vh" : "20vh",
      }}
    >
      <Box
        sx={{
          width: isMobile ? 40 : 60,
          height: isMobile ? 40 : 60,
          borderRadius: "50%",
          backgroundColor: fillPercentage > 0 ? mainBlue : "#e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          transition: "background-color 0.3s ease-in-out",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: fillPercentage > 0 ? "white" : "action.active",
            fontSize: isMobile ? 20 : 30,
          },
        })}
      </Box>
      <Box
        sx={{
          ml: isMobile ? 2 : 3,
          mt: 1,
          p: isMobile ? 1.5 : 2,
          borderRadius: 2,
          backgroundColor: fillPercentage > 0 ? `${mainBlue}1A` : "white",
          transition: "background-color 0.3s ease-in-out",
          width: "calc(100% - 60px)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TimelineEventTitle variant={isMobile ? "subtitle1" : "h6"}>
            {time}
          </TimelineEventTitle>
          {isExpandable && (
            <EventButton
              onClick={handleOpenDialog}
              size={isMobile ? "small" : "medium"}
              sx={{ minWidth: "auto", padding: "6px" }}
            >
              <InfoIcon />
            </EventButton>
          )}
        </Box>
        <TimelineEventDescription
          variant={isMobile ? "body2" : "body1"}
          sx={{ mt: 1 }}
        >
          {description}
        </TimelineEventDescription>
      </Box>
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: isMobile ? 20 : 30,
            top: isMobile ? 40 : 60,
            bottom: isMobile ? -56 : -64,
            width: 4,
            backgroundColor: "#e0e0e0",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: `${fillPercentage}%`,
              backgroundColor: mainBlue,
              transition: "height 0.3s ease-in-out",
            }}
          />
        </Box>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <CustomDialogTitle>
          {description}
          <CloseButton aria-label="close" onClick={handleCloseDialog}>
            <CloseIcon />
          </CloseButton>
        </CustomDialogTitle>
        <CustomDialogContent>
          <EventLocations eventLocations={locations} />
        </CustomDialogContent>
      </Dialog>
    </Box>
  );
};

TimelineItem.propTypes = {
  icon: PropTypes.element.isRequired,
  time: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  fillPercentage: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  locations: PropTypes.array,
  isExpandable: PropTypes.bool.isRequired,
};

export default TimelineItem;
