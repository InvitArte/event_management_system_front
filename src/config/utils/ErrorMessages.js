// src/constants/errorMessages.js

const commonErrors = {
  "Server error": "Error del servidor. Por favor, inténtalo más tarde.",
  "Network error":
    "Error de conexión. Por favor, verifica tu conexión a internet.",
};

export const httpStatusErrors = {
  400: "Solicitud incorrecta. Por favor, verifica los datos enviados.",
  401: "No autorizado. Por favor, inicia sesión nuevamente.",
  403: "Acceso prohibido. No tienes permisos para realizar esta acción.",
  404: "Recurso no encontrado.",
  405: "Método no permitido.",
  422: "Los datos proporcionados no son válidos.",
  429: "Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.",
  500: "Error interno del servidor. Por favor, inténtalo más tarde.",
};

export const validationErrors = {
  "The email field must be a valid email address.":
    "El campo de correo electrónico debe ser una dirección válida.",
  "The provided credentials are incorrect.":
    "Las credenciales proporcionadas son incorrectas.",
  "The email field is required.":
    "El campo de correo electrónico es obligatorio.",
  "The password field is required.": "El campo de contraseña es obligatorio.",
  "These credentials do not match our records.":
    "Las credenciales proporcionadas no coinciden con nuestros registros.",
  "The password must be at least 8 characters.":
    "La contraseña debe tener al menos 8 caracteres.",
  // Añade aquí más mensajes de validación según sea necesario
};

export const translateError = (error) => {
  if (error.response && error.response.data) {
    const { data } = error.response;

    // Verificar si hay un mensaje de error directo
    if (data.message && validationErrors[data.message]) {
      return validationErrors[data.message];
    }

    // Verificar errores de validación
    if (data.errors) {
      const firstErrorKey = Object.keys(data.errors)[0];
      if (firstErrorKey && data.errors[firstErrorKey][0]) {
        const errorMessage = data.errors[firstErrorKey][0];
        return validationErrors[errorMessage] || errorMessage;
      }
    }

    // Si no hay traducción, devolver el mensaje original
    return (
      data.message ||
      "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
    );
  }

  // Manejar errores de red u otros errores de Axios
  if (error.message) {
    return commonErrors[error.message] || error.message;
  }

  return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo.";
};
