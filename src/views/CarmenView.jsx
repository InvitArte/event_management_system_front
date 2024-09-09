import React from "react";
import PropTypes from "prop-types";
import { Grid, Box } from "@mui/material";
import Azulejo from "../assets/imgs/Azulejo1.jpeg";
import CarmenHeader from "../components/CarmenView/CarmenHeader";
import CarmenEventCard from "../components/CarmenView/CarmenEventCard";
import CSvg from "../assets/imgs/C.svg";

const CarmenView = ({ userId, isLoading }) => {
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${Azulejo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={CSvg}
        alt="C icon"
        sx={{
          position: "fixed",
          top: "10px",
          left: "10px",
          width: "100px", // Ajusta el tamaño aquí
          height: "100px", // Ajusta el tamaño aquí
          zIndex: 1001,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      <CarmenHeader />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Grid container>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <CarmenEventCard userId={userId} />
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </Box>
    </Box>
  );
};

CarmenView.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CarmenView;
