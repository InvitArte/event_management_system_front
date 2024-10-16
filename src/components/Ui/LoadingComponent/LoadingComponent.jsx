// React
import React from "react";

// Material-UI
import { Box, LinearProgress, keyframes } from "@mui/material";

// Assets
import DemoLogo from "../../../assets/imgs/demo_logo.png";

const fadeInAndGrow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const moveToCorner = keyframes`
  0% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 200px;
    height: 200px;
  }
  100% {
    top: 10px;
    left: 10px;
    transform: translate(0, 0) scale(0.5);
    width: 100px;
    height: 100px;
  }
`;

const shine = keyframes`
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
`;

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
          backgroundColor: "#8D5444",
          zIndex: 1000,
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? "auto" : "none",
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Box
          component="img"
          src={DemoLogo}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "200px",
            height: "200px",
            objectFit: "contain",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
            animation: isLoading
              ? `${fadeInAndGrow} 0.5s ease-in-out, ${shine} 3s linear infinite`
              : `${moveToCorner} 0.5s ease-in-out forwards`,
            opacity: 1,
            filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.4))",
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