import React from "react";
import PropTypes from "prop-types";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import {
  StyledGiftMessage,
  GiftMessageText,
  AccountNumber,
  mainBlue,
} from "./ConfirmationModalStyles";

const GiftMessage = ({ accountNumber }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <StyledGiftMessage>
      <GiftMessageText variant="body2" align="center">
        Para todos aquellos que deseen colaborar en nuestra nueva vida juntos,
        os facilitamos nuestro número de cuenta:
      </GiftMessageText>
      <AccountNumber
        variant="body2"
        mt={1}
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontStyle: "italic",
          letterSpacing: "normal",
          fontWeight: 500,
          fontSize: isMobile ? "0.75rem" : "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {accountNumber}
      </AccountNumber>
    </StyledGiftMessage>
  );
};

GiftMessage.propTypes = {
  accountNumber: PropTypes.string.isRequired,
};

export default GiftMessage;
