import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import HeaderImage from "../../assets/imgs/TODO_COLOR.jpg";
import { mainBlue } from "./ConfirmationModalStyles";

/**
 * Componente CarmenHeader
 * 
 * Este componente muestra un encabezado con una imagen de fondo y, opcionalmente,
 * un título superpuesto. Incluye efectos de desplazamiento para dispositivos móviles.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.showTitle - Indica si se debe mostrar el título superpuesto
 */
const CarmenHeader = ({ showTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [overscrollAmount, setOverscrollAmount] = useState(0);

  /**
   * Efecto para manejar el desplazamiento excesivo en dispositivos móviles
   */
  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      currentY = e.touches[0].clientY;
      if (window.scrollY === 0 && currentY > startY) {
        const diff = currentY - startY;
        setOverscrollAmount(Math.min(diff, 100)); // Limitar la expansión
        e.preventDefault();
      } else {
        setOverscrollAmount(0);
      }
    };

    const handleTouchEnd = () => {
      setOverscrollAmount(0);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const scale = 1 + overscrollAmount / 1000;

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <Box sx={getImageStyles(isMobile, overscrollAmount, scale)} />
      {showTitle && renderTitle()}
    </Box>
  );
};

/**
 * Obtiene los estilos para el contenedor principal
 * @param {boolean} isMobile - Indica si es dispositivo móvil
 * @returns {Object} Objeto de estilos
 */
const getContainerStyles = (isMobile) => ({
  width: "100%",
  height: isMobile ? "100vh" : "auto",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    display: "block",
    paddingTop: isMobile ? "0" : "33.33%",
  },
  backgroundColor: "transparent",
});

/**
 * Obtiene los estilos para la imagen de fondo
 * @param {boolean} isMobile - Indica si es dispositivo móvil
 * @param {number} overscrollAmount - Cantidad de desplazamiento excesivo
 * @param {number} scale - Factor de escala para el efecto de zoom
 * @returns {Object} Objeto de estilos
 */
const getImageStyles = (isMobile, overscrollAmount, scale) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: isMobile ? 0 : "auto",
  height: `calc(100% + ${overscrollAmount}px)`,
  backgroundImage: `url(${HeaderImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  boxShadow: isMobile ? "none" : "0 8px 15px rgba(0, 0, 0, 0.3)",
  maskImage: getMaskImage(isMobile),
  maskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskImage: getMaskImage(isMobile),
  WebkitMaskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  zIndex: 1,
  transform: `scale(${scale})`,
  transformOrigin: "center top",
  transition: "transform 0.1s ease-out",
});

/**
 * Obtiene la imagen de máscara para el efecto de desvanecimiento
 * @param {boolean} isMobile - Indica si es dispositivo móvil
 * @returns {string} Valor de la propiedad CSS para la máscara
 */
const getMaskImage = (isMobile) =>
  isMobile
    ? "linear-gradient(to bottom, black 80%, transparent 100%)"
    : `linear-gradient(to right, 
         transparent, 
         black 10%, 
         black 90%, 
         transparent
       ),
       linear-gradient(to bottom, 
         black 0%,
         black 80%, 
         transparent 100%
       )`;

/**
 * Renderiza el título superpuesto
 * @returns {React.ReactNode}
 */
const renderTitle = () => (
  <Box sx={getTitleContainerStyles()}>
    <Typography variant="h2" sx={getSubtitleStyles()}>
      ¡Nos casamos!
    </Typography>
    <Typography variant="h1" sx={getTitleStyles()}>
      Carmen y César
    </Typography>
  </Box>
);

/**
 * Obtiene los estilos para el contenedor del título
 * @returns {Object} Objeto de estilos
 */
const getTitleContainerStyles = () => ({
  position: "absolute",
  top: "75%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: "white",
  zIndex: 2,
  width: "90%",
  padding: "20px",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(3px)",
  borderRadius: "15px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
});

/**
 * Obtiene los estilos para el subtítulo
 * @returns {Object} Objeto de estilos
 */
const getSubtitleStyles = () => ({
  mb: 2,
  fontFamily: "'Parisienne', cursive",
  fontSize: "2.5rem",
  color: "#ffffff",
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
});

/**
 * Obtiene los estilos para el título principal
 * @returns {Object} Objeto de estilos
 */
const getTitleStyles = () => ({
  fontFamily: "'Parisienne', cursive",
  fontSize: "3.5rem",
  color: "#ffffff",
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
});

CarmenHeader.propTypes = {
  showTitle: PropTypes.bool.isRequired,
};

export default CarmenHeader;