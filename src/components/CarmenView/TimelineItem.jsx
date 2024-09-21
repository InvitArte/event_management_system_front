import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Container,
  Modal,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import EventLocations from "./EventLocations";


const mainBlue = "#153e87";

const TimelineItem = ({
  icon,
  time,
  description,
  fillPercentage,
  isLast,
  locations,
  isExpandable,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    if (isExpandable) {
      if (isMobile) {
        setIsModalOpen(true);
      } else {
        setIsExpanded(!isExpanded);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        position: "relative",
        mb: isLast ? 0 : { xs: 6, sm: 8 },
        height: "auto",
        minHeight: { xs: "15vh", sm: "20vh" },
      }}
    >
      <Box
        sx={{
          width: { xs: 40, sm: 60 },
          height: { xs: 40, sm: 60 },
          borderRadius: "50%",
          backgroundColor: fillPercentage > 0 ? mainBlue : "#e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          transition: "all 0.3s ease-in-out",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: fillPercentage > 0 ? "white" : "action.active",
            fontSize: { xs: 20, sm: 30 },
          },
        })}
      </Box>
      <Paper
        elevation={3}
        onClick={handleClick}
        sx={{
          ml: { xs: 2, sm: 3 },
          mt: 1,
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          backgroundColor: fillPercentage > 0 ? `${mainBlue}1A` : "white",
          transition: "all 0.3s ease-in-out",
          width: "calc(100% - 60px)",
          position: "relative",
          cursor: isExpandable ? "pointer" : "default",
          opacity: fillPercentage > 0 ? 1 : 0.5,
          transform: fillPercentage > 0 ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          "&:hover": isExpandable
            ? {
                transform: "translateY(-5px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              }
            : {},
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color={mainBlue}
            sx={{
              fontFamily: "'Parisienne', regular",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {time}
          </Typography>
          {isExpandable && !isMobile && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
                color: mainBlue,
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 1,
            fontFamily: "'Parisienne', regular",
            fontSize: { xs: "1.2rem", sm: "1.4rem" },
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </Typography>
        {!isMobile && (
          <Collapse in={isExpanded}>
            <Box sx={{ mt: 2 }}>
              <EventLocations eventLocations={locations} />
            </Box>
          </Collapse>
        )}
      </Paper>
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            left: { xs: 20, sm: 30 },
            top: { xs: 40, sm: 60 },
            bottom: { xs: -48, sm: -64 },
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
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontFamily: "'Parisienne', regular",
              fontSize: "2rem",
              mb: 2,
            }}
          >
            {time}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              fontFamily: "'Parisienne', regular",
              fontSize: "1.4rem",
              mb: 2,
            }}
          >
            {description}
          </Typography>
          <EventLocations eventLocations={locations} />
        </Box>
      </Modal>
    </Box>
  );
};

export default TimelineItem;