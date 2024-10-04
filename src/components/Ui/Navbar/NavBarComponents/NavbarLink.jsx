// React
import React from "react";

// Biblioteca de terceros
import PropTypes from "prop-types";

// Material-UI
import { Button } from "@mui/material";

// Componentes propios
import { StyledNavLink } from "./NavbarStyles";

const NavbarLink = ({ to, children }) => (
  <Button color="inherit" component={StyledNavLink} to={to}>
    {children}
  </Button>
);

NavbarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavbarLink;
