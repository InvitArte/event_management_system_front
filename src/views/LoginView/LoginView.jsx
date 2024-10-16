// React y hooks
import React, { useState } from "react";

// Bibliotecas de terceros
import { useNavigate } from "react-router-dom";

// Material-UI
import { Container, Paper, Typography, Box, Alert } from "@mui/material";

// Servicios y configuraciones
import { authService } from "../../services/Api";
import { translateError } from "../../config";

// Componentes propios
import { LoginForm } from "./LoginViewComponents";


const LoginView = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/guests");
      } else {
        setError(
          "Inicio de sesión correcto, pero no se recibió el token de acceso."
        );
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err);
      const translatedError = translateError(err);
      setError(translatedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginView;
