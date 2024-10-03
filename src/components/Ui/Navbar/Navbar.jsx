import React, { useState, useEffect } from "react";
import { Toolbar, Typography, Container, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { 
  Menu as MenuIcon,
  People as PeopleIcon,
  LocalOffer as LocalOfferIcon,
  Contacts as ContactsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNavbar } from "../../../hooks";
import { 
  NavbarLink, 
  UserMenu, 
  MobileDrawer, 
  AnimatedAppBar 
} from './NavBarComponents';

const SCROLL_THRESHOLD = 50;

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    isScrolled,
    setIsScrolled,
    anchorEl,
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
  } = useNavbar(SCROLL_THRESHOLD);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

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

  const handleNavbarClick = () => {
    if (isMobile && isScrolled) {
      setIsNavbarExpanded(!isNavbarExpanded);
    }
  };

  useEffect(() => {
    if (isMobile && isNavbarExpanded) {
      const handleScroll = () => {
        setIsNavbarExpanded(false);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobile, isNavbarExpanded]);

  const menuItems = [
    { icon: <PeopleIcon />, to: "/guests", label: "Invitados" },
    { icon: <LocalOfferIcon />, to: "/tags", label: "Etiquetas" },
    { icon: <ContactsIcon />, to: "/contacts", label: "Contactos" },
    { icon: <PersonIcon />, to: "/profile", label: "Perfil", onClick: handleProfile },
    { icon: <SettingsIcon />, to: "/settings", label: "Ajustes", onClick: handleSettings },
    { icon: <ExitToAppIcon />, label: "Desconectarse", onClick: handleLogout },
  ];

  return (
    <AnimatedAppBar 
      position="fixed" 
      elevation={3} 
      isScrolled={isScrolled && !isNavbarExpanded}
      onClick={handleNavbarClick}
    >
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