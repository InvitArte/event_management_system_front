import React from "react";
import { Toolbar, Typography, Container, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { AnimatedAppBar } from "../../config/NavbarStyles";
import { useScrollDetection, useUserMenu } from "../../hooks/NavbarHooks";
import NavbarLink from "./Navbar/NavbarLink";
import UserMenu from "./Navbar/UserMenu";

const SCROLL_THRESHOLD = 50;

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
          <NavbarLink to="/contacts">Contactos</NavbarLink>
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
