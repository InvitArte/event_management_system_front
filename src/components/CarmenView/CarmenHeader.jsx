import React from "react";
import { Box } from "@mui/material";
import HeaderImage from "../../assets/imgs/Test1.jpg";

const CarmenHeader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        position: "relative",
        "&::after": {
          content: '""',
          display: "block",
          paddingTop: "33.33%", // Mantiene el aspect ratio de 3:1
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${HeaderImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // Añadir box-shadow en el borde inferior para darle volumen
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.3)", // Sombra más fuerte en el borde inferior
          maskImage: `linear-gradient(to right, transparent, black 10%, black 90%, transparent),
                      linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
          maskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `linear-gradient(to right, transparent, black 10%, black 90%, transparent),
                            linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
          WebkitMaskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    </Box>
  );
};

export default CarmenHeader;
