import React from "react";
import { Box, LinearProgress } from "@mui/material";
import CSvg from "../../assets/imgs/C.svg";

const LoadingComponent = ({ isLoading, type = "bar" }) => {
  if (type === "svg") {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 1000,
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? "auto" : "none",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Box
          component="img"
          src={CSvg}
          alt="Loading"
          sx={{
            width: isLoading ? "200px" : "100px", // Aumenta el tamaño aquí
            height: isLoading ? "200px" : "100px", // Aumenta el tamaño aquí
            position: "fixed",
            top: isLoading ? "50%" : "10px",
            left: isLoading ? "50%" : "10px",
            transform: isLoading ? "translate(-50%, -50%)" : "none",
            transition: "all 0.5s ease-in-out",
            zIndex: 1001,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000 }}
    >
      <LinearProgress />
    </Box>
  );
};

export default LoadingComponent;
