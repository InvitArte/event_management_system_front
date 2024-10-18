// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

// Componentes propios
import { ConfirmButton } from "./index";

// Assets y estilos
import { mainBlue } from "./index";

const CarmenHeader = ({ onOpenModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <Box sx={getTitleContainerStyles(isMobile)}>
        <Typography variant="h3" sx={getSubtitleStyles()}>
          ¡Nos casamos!
        </Typography>
        <Typography variant="h1" sx={getTitleStyles()}>
          Pareja <span style={getAmpersandStyles()}>&</span> Pareja
        </Typography>
        <Box sx={getButtonContainerStyles()}>
          <ConfirmButton onClick={onOpenModal} fullWidth={isMobile} />
        </Box>
      </Box>
    </Box>
  );
};

const getContainerStyles = (isMobile) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: isMobile ? "20px" : "40px",
});

const getTitleContainerStyles = (isMobile) => ({
  padding: isMobile ? "20px 40px" : "40px 80px",
  backgroundColor: "rgba(255, 255, 255, 0.4)",
  backdropFilter: "blur(1px)",
  borderRadius: "2px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: isMobile ? "auto" : "80%",
  maxWidth: "800px",
});

const getSubtitleStyles = () => ({
  fontFamily: "'CormorantUpright', regular",
  fontSize: { xs: "1.2rem", sm: "1.5rem" },
  color: "#555555",
  textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
  marginBottom: "10px",
});

const getTitleStyles = () => ({
  fontFamily: "'CormorantUpright', regular",
  fontSize: { xs: "2.5rem", sm: "3.5rem" },
  color: "#333333",
  textShadow: "2px 2px 4px rgba(255,255,255,0.5)",
  textAlign: "center",
  lineHeight: 1.2,
});

const getAmpersandStyles = () => ({
  fontSize: "1.5em",
  color: mainBlue,
  verticalAlign: "middle",
});

const getButtonContainerStyles = () => ({
  marginTop: "20px",
  width: { xs: "100%", sm: "auto" },
});

CarmenHeader.propTypes = {
  onOpenModal: PropTypes.func.isRequired,
};

export default CarmenHeader;