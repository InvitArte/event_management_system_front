import React, { useState } from "react";
import { Toolbar, Typography, Container, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ContactsIcon from "@mui/icons-material/Contacts";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { AnimatedAppBar } from "../../config/NavbarStyles";
import { useScrollDetection, useUserMenu } from "../../hooks/NavbarHooks";
import NavbarLink from "./Navbar/NavbarLink";
import UserMenu from "./Navbar/UserMenu";
import MobileDrawer from "./Navbar/MobileDrawer";

const SCROLL_THRESHOLD = 50;

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isScrolled } = useScrollDetection(SCROLL_THRESHOLD);
  const {
    anchorEl,
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
  } = useUserMenu(navigate);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { icon: <PeopleIcon />, to: "/guests", label: "Invitados" },
    { icon: <LocalOfferIcon />, to: "/tags", label: "Etiquetas" },
    { icon: <ContactsIcon />, to: "/contacts", label: "Contactos" },
    { icon: <PersonIcon />, to: "/profile", label: "Perfil", onClick: handleProfile },
    { icon: <SettingsIcon />, to: "/settings", label: "Ajustes", onClick: handleSettings },
    { icon: <ExitToAppIcon />, label: "Desconectarse", onClick: handleLogout },
  ];

  return (
    <AnimatedAppBar position="fixed" elevation={3} isScrolled={isScrolled}>
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Toolbar
          disableGutters
          sx={{ height: "100%", justifyContent: "space-between" }}
        >
          <Typography variant="h6" component="div">
            InvitArte
          </Typography>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
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
                <PersonIcon />
              </IconButton>
            </>
          )}
          {!isMobile && (
            <UserMenu
              anchorEl={anchorEl}
              isOpen={isMenuOpen}
              onClose={handleMenuClose}
              onProfile={handleProfile}
              onSettings={handleSettings}
              onLogout={handleLogout}
            />
          )}
          {isMobile && (
            <MobileDrawer
              isOpen={isDrawerOpen}
              onClose={toggleDrawer}
              menuItems={menuItems}
            />
          )}
        </Toolbar>
      </Container>
    </AnimatedAppBar>
  );
};

export default Navbar;