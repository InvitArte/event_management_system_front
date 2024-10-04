
// React
import React from "react";

// Biblioteca de terceros
import { Outlet } from "react-router-dom";

// Material-UI
import { Box, Container } from "@mui/material";

// Componentes propios
import { Navbar, Footer } from "../../index";

const ProtectedLayout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          mt: "80px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default ProtectedLayout;
