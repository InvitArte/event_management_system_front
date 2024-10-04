// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Typography, useMediaQuery, useTheme } from "@mui/material";

// Componentes y estilos personalizados
import {
  StyledGiftMessage,
  GiftMessageText,
  AccountNumber,
  mainBlue,
} from "./ConfirmationModalStyles";

/**
 * Componente GiftMessage
 *
 * Este componente muestra un mensaje para los invitados que deseen hacer un regalo
 * en forma de contribución monetaria, incluyendo un número de cuenta bancaria.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.accountNumber - Número de cuenta bancaria
 */
const GiftMessage = ({ accountNumber }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledGiftMessage>
      {renderGiftMessageText()}
      {renderAccountNumber(accountNumber, isMobile)}
    </StyledGiftMessage>
  );
};

/**
 * Renderiza el texto principal del mensaje de regalo
 * @returns {React.ReactNode}
 */
const renderGiftMessageText = () => (
  <GiftMessageText variant="body2" align="center">
    Para todos aquellos que deseen colaborar en nuestra nueva vida juntos,
    os facilitamos nuestro número de cuenta:
  </GiftMessageText>
);

/**
 * Renderiza el número de cuenta con estilos responsivos
 * @param {string} accountNumber - Número de cuenta bancaria
 * @param {boolean} isMobile - Indica si el dispositivo es móvil
 * @returns {React.ReactNode}
 */
const renderAccountNumber = (accountNumber, isMobile) => (
  <AccountNumber
    variant="body2"
    mt={1}
    sx={getAccountNumberStyles(isMobile)}
  >
    {accountNumber}
  </AccountNumber>
);

/**
 * Obtiene los estilos para el número de cuenta
 * @param {boolean} isMobile - Indica si el dispositivo es móvil
 * @returns {Object} Estilos para el número de cuenta
 */
const getAccountNumberStyles = (isMobile) => ({
  fontFamily: "'Roboto', sans-serif",
  fontStyle: "italic",
  letterSpacing: "normal",
  fontWeight: 500,
  fontSize: isMobile ? "0.75rem" : "0.875rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
});

GiftMessage.propTypes = {
  accountNumber: PropTypes.string.isRequired,
};

export default GiftMessage;