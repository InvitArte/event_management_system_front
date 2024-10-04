import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Navbar from "../../Ui/Navbar/Navbar";
import Footer from "../../Ui/Footer/Footer";

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
