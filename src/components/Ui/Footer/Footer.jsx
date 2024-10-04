// React
import React from "react";

// Material-UI
import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Gestor de Eventos
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          © {new Date().getFullYear()} InvitArte. ATodos los derechos
          reservados.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="#">
            Política de Privacidad
          </Link>
          {" | "}
          <Link color="inherit" href="#">
            Terminos y Condiciones
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
