// React y hooks
import React, { useState, useEffect } from "react";

// Material UI
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Modal,
  Collapse,
  Button,
  CircularProgress,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { ExpandMore as ExpandMoreIcon, Close as CloseIcon } from "@mui/icons-material";

// Componentes propios
import EventLocations from "./EventLocations";

const mainBlue = "#8D5444";

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
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));





  const handleClick = () => {
    if (isExpandable) {
      if (isMobile) {
        setIsModalOpen(true);
        setIsLoading(false);
      } else {
        setIsExpanded(!isExpanded);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderLocationContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} sx={{ color: mainBlue }} />
        </Box>
      );
    } else if (locations && locations.length > 0) {
      const address = locations[0].direccion || 'Dirección no disponible';;
      return (
        <Typography
          sx={{
            fontFamily: "'CormorantUpright', serif",
            fontSize: "1.2rem",
            mb: 2,
            color: "text.primary",
          }}
        >
          {address}
        </Typography>
      );
    } else {
      return (
        <Typography
          sx={{
            fontFamily: "'CormorantUpright', serif",
            fontSize: "1.2rem",
            mb: 2,
            color: "text.secondary",
          }}
        >
          No se pudo cargar la ubicación.
        </Typography>
      );
    }
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
          width: "calc(100% - 60px)",
          position: "relative",
          cursor: isExpandable ? "pointer" : "default",
          opacity: fillPercentage > 0 ? 1 : 0.5,
          transform: fillPercentage > 0 ? "translateX(0)" : "translateX(20px)",
          transition: "all 0.3s ease-in-out, opacity 0.5s ease-out, transform 0.5s ease-out",
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
              fontFamily: "'CormorantUpright', serif",
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
            fontFamily: "'CormorantUpright', serif",
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
            bgcolor: fillPercentage > 0 ? "#EEE8E4" : "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            border: `2px solid ${mainBlue}`,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: mainBlue,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "'CormorantUpright', serif",
              fontSize: "2.5rem",
              mb: 2,
              fontWeight: "bold",
              color: mainBlue,
            }}
          >
            {time}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              fontFamily: "'CormorantUpright', serif",
              fontSize: "1.5rem",
              mb: 3,
              color: "text.primary",
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'CormorantUpright', serif",
              fontSize: "1.3rem",
              mb: 1,
              fontWeight: "bold",
              color: mainBlue,
            }}
          >
            Ubicación:
          </Typography>
          {renderLocationContent()}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              sx={{
                mt: 2,
                fontFamily: "'CormorantUpright', serif",
                fontSize: "1rem",
                color: mainBlue,
                borderColor: mainBlue,
                "&:hover": {
                  borderColor: mainBlue,
                  backgroundColor: `${mainBlue}33`,
                },
              }}
            >
              CÓMO LLEGAR
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TimelineItem;