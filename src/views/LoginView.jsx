/**
 * @file LoginView.jsx
 * @description Componente de vista para la página de inicio de sesión.
 */

import React, { useState } from "react";
import { Container, Paper, Typography, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginView/LoginForm";
import { authService } from "../services/Api";
import { translateError } from "../config/ErrorMessages";

/**
 * @function LoginView
 * @description Componente principal que gestiona la vista de inicio de sesión.
 * @returns {JSX.Element} Elemento JSX que representa la vista de inicio de sesión.
 */
const LoginView = () => {
  /**
   * @type {[string, function]} error
   * @description Estado para almacenar mensajes de error.
   */
  const [error, setError] = useState("");

  /**
   * @type {[boolean, function]} loading
   * @description Estado para controlar el estado de carga durante el inicio de sesión.
   */
  const [loading, setLoading] = useState(false);

  /**
   * @type {function} navigate
   * @description Función de navegación proporcionada por react-router-dom.
   */
  const navigate = useNavigate();

  /**
   * @function handleLogin
   * @description Maneja el proceso de inicio de sesión.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   */
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
