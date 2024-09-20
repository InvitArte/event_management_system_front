import React from "react";
import PropTypes from "prop-types";
import { InvertedEventButton } from "./ConfirmationModalStyles";

const ConfirmButton = ({ onClick, className, fullWidth }) => (
  <InvertedEventButton
    onClick={onClick}
    fullWidth={fullWidth}
    className={className}
  >
    Confirmar asistencia
  </InvertedEventButton>
);

ConfirmButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default ConfirmButton;
