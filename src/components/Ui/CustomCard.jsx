import React from "react";
import { Card, styled } from "@mui/material";
import PropTypes from "prop-types";

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  },
  // Puedes agregar más estilos base aquí
}));

const CustomCard = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <StyledCard ref={ref} {...props}>
      {children}
    </StyledCard>
  );
});

CustomCard.displayName = "CustomCard";

CustomCard.propTypes = {
  children: PropTypes.node,
};

export default CustomCard;
