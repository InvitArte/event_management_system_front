import React from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@mui/material";

const UserMenu = ({ anchorEl, isOpen, onClose, onProfile, onLogout }) => (
  <Menu
    anchorEl={anchorEl}
    open={isOpen}
    onClose={onClose}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
  >
    <MenuItem onClick={onProfile}>Perfil</MenuItem>
    <MenuItem onClick={onLogout}>Desconectarse</MenuItem>
  </Menu>
);

UserMenu.propTypes = {
  anchorEl: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenu;
