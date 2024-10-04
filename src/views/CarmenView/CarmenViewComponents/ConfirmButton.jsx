// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Componentes estilizados
import { InvertedEventButton } from "./ConfirmationModalStyles";

/**
 * Componente ConfirmButton
 *
 * Este componente renderiza un botón de confirmación de asistencia.
 * Utiliza el estilo InvertedEventButton y puede ajustarse a ancho completo.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClick - Función a ejecutar al hacer clic en el botón
 * @param {string} [props.className] - Clase CSS adicional para el botón
 * @param {boolean} [props.fullWidth] - Si es true, el botón ocupará todo el ancho disponible
 */
const ConfirmButton = ({ onClick, className, fullWidth }) => {
  return (
    <InvertedEventButton
      onClick={onClick}
      fullWidth={fullWidth}
      className={className}
    >
      Confirmar asistencia
    </InvertedEventButton>
  );
};

ConfirmButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};


export default ConfirmButton;