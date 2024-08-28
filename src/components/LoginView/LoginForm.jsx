/**
 * @file LoginForm.jsx
 * @description Componente de formulario para el inicio de sesión de usuarios.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * @function LoginForm
 * @description Componente que renderiza un formulario de inicio de sesión.
 * @param {Object} props - Propiedades del componente
 * @param {function} props.onSubmit - Función a llamar cuando se envía el formulario
 * @returns {JSX.Element} Elemento JSX que representa el formulario de inicio de sesión
 */
const LoginForm = ({ onSubmit }) => {
  /**
   * @type {[string, function]} email
   * @description Estado para almacenar el email ingresado por el usuario
   */
  const [email, setEmail] = useState("");

  /**
   * @type {[string, function]} password
   * @description Estado para almacenar la contraseña ingresada por el usuario
   */
  const [password, setPassword] = useState("");

  /**
   * @type {[boolean, function]} showPassword
   * @description Estado para controlar la visibilidad de la contraseña
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  /**
   * @function handleClickShowPassword
   * @description Alterna la visibilidad de la contraseña
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * @function handleMouseDownPassword
   * @description Previene el comportamiento por defecto al hacer clic en el botón de visibilidad
   * @param {Event} event - Evento de mouse down
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Acceder
      </Button>
    </Box>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
