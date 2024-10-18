// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Typography, useMediaQuery, useTheme, Box } from "@mui/material";

// Estilos
import { mainBlue } from "./ConfirmationModalStyles";

const GiftMessage = ({ accountNumber }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        background: 'transparent',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
      }}
    >
      {renderGiftMessageText(theme)}
      {renderAccountNumber(accountNumber, isMobile, theme)}
    </Box>
  );
};

const renderGiftMessageText = (theme) => (
  <Typography
    variant="body1"
    align="center"
    sx={{
      fontFamily: "'CormorantUpright', cursive",
      fontSize: { xs: '1.2rem', sm: '1.5rem' },
      marginBottom: theme.spacing(2),
      color: 'inherit',
    }}
  >
    Para todos aquellos que deseen colaborar en nuestra nueva vida juntos,
    os facilitamos nuestro número de cuenta:
  </Typography>
);

const renderAccountNumber = (accountNumber, isMobile, theme) => (
  <Typography
    variant="body1"
    align="center"
    sx={{
      ...getAccountNumberStyles(isMobile, theme),
      color: mainBlue,
      backgroundColor: 'transparent',
      padding: theme.spacing(1, 2),
      display: 'inline-block',
    }}
  >
    {accountNumber}
  </Typography>
);

const getAccountNumberStyles = (isMobile, theme) => ({
  fontFamily: "'Roboto', sans-serif",
  fontStyle: "italic",
  letterSpacing: "0.5px",
  fontWeight: 500,
  fontSize: isMobile ? "0.9rem" : "1rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
});

GiftMessage.propTypes = {
  accountNumber: PropTypes.string.isRequired,
};

export default GiftMessage;