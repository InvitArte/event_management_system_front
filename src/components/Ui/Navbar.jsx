import React, { useState, useEffect } from "react";
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
import { authService } from "../../services/api";
import { AnimatedAppBar, StyledNavLink } from "../../config/NavbarStyles";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleUserMenuClose();
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      handleUserMenuClose();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AnimatedAppBar position="fixed" elevation={3} scrolled={scrolled}>
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Toolbar
          disableGutters
          sx={{ height: "100%", justifyContent: "center" }}
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InvitArte
          </Typography>
          <Button color="inherit" component={StyledNavLink} to="/guests">
            Invitados
          </Button>
          <Button color="inherit" component={StyledNavLink} to="/tags">
            Etiquetas
          </Button>
          <IconButton color="inherit" onClick={handleUserMenuOpen}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleProfile}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Desconectarse</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AnimatedAppBar>
  );
};

export default Navbar;
