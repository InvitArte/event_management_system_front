import React, { useState, useEffect } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import HeaderImage from "../../assets/imgs/TODO_COLOR.jpg";
import { mainBlue } from "./ConfirmationModalStyles";

const CarmenHeader = ({ showTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [overscrollAmount, setOverscrollAmount] = useState(0);

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
    <Box
      sx={{
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
      }}
    >
      <Box
        sx={{
          position: isMobile ? "absolute" : "absolute",
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
          maskImage: isMobile
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
               )`,
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskImage: isMobile
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
               )`,
          WebkitMaskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          zIndex: 1,
          transform: `scale(${scale})`,
          transformOrigin: "center top",
          transition: "transform 0.1s ease-out",
        }}
      />
      {showTitle && (
        <Box
          sx={{
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
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 2,
              fontFamily: "'Parisienne', cursive",
              fontSize: "2.5rem",
              color: "#fffff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            ¡Nos casamos!
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Parisienne', cursive",
              fontSize: "3.5rem",
              color: "#fffff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Carmen y César
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CarmenHeader;
