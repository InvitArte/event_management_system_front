// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { shouldForwardProp } from '@mui/system';
import { Box, styled } from "@mui/material";

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'useCardStyles' && shouldForwardProp(prop),
})(({ theme, useCardStyles }) => ({
  ...(useCardStyles && {
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    "&:hover": {
      boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    },
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  }),
}));

const CustomCard = React.forwardRef(({ children, useCardStyles = true, ...props }, ref) => {
  return (
    <StyledBox ref={ref} useCardStyles={useCardStyles} {...props}>
      {children}
    </StyledBox>
  );
});

CustomCard.displayName = "CustomCard";

CustomCard.propTypes = {
  children: PropTypes.node,
  useCardStyles: PropTypes.bool,
};

export default CustomCard;