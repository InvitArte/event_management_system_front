import React from "react";
import PropTypes from "prop-types";
import {
  Toolbar,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { AnimatedAppBar, StyledNavLink } from "../../config/NavbarStyles";
import { useScrollDetection, useUserMenu } from "../../hooks/NavbarHooks";

const SCROLL_THRESHOLD = 50;

const NavbarLink = ({ to, children }) => (
  <Button color="inherit" component={StyledNavLink} to={to}>
    {children}
  </Button>
);

NavbarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

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

const Navbar = () => {
  const navigate = useNavigate();
  const { isScrolled } = useScrollDetection(SCROLL_THRESHOLD);
  const {
    anchorEl,
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
  } = useUserMenu(navigate);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  return (
    <AnimatedAppBar position="fixed" elevation={3} isScrolled={isScrolled}>
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Toolbar
          disableGutters
          sx={{ height: "100%", justifyContent: "center" }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvitArte
          </Typography>
          <NavbarLink to="/guests">Invitados</NavbarLink>
          <NavbarLink to="/tags">Etiquetas</NavbarLink>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="cuenta de usuario"
            aria-controls="user-menu"
            aria-haspopup="true"
          >
            <AccountCircleIcon />
          </IconButton>
          <UserMenu
            anchorEl={anchorEl}
            isOpen={isMenuOpen}
            onClose={handleMenuClose}
            onProfile={handleProfile}
            onLogout={handleLogout}
          />
        </Toolbar>
      </Container>
    </AnimatedAppBar>
  );
};

export default Navbar;
