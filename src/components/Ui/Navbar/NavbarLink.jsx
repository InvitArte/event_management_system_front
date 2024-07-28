import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { StyledNavLink } from "../../../config/NavbarStyles";

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
