import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { NavLink, useNavigate } from "react-router-dom";

const bounceIn = keyframes`
  0% { transform: translateY(-100%); }
  50% { transform: translateY(8%); }
  65% { transform: translateY(-4%); }
  80% { transform: translateY(4%); }
  95% { transform: translateY(-2%); }
  100% { transform: translateY(0); }
`;

const AnimatedAppBar = styled(AppBar)`
  animation: ${bounceIn} 1.2s ease-out;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top center;

  &:hover {
    width: 90% !important;
    left: 5% !important;
    height: 64px !important;

    .MuiToolbar-root {
      opacity: 1 !important;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
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

  const handleLogout = () => {
    // Implement logout logic here
    // For example:
    // logout();
    navigate("/login");
  };

  return (
    <AnimatedAppBar
      position="fixed"
      elevation={3}
      sx={{
        width: scrolled ? "100px" : "90%",
        left: scrolled ? "calc(50% - 50px)" : "5%",
        height: scrolled ? "30px" : "64px",
        borderBottomLeftRadius: "46px",
        borderBottomRightRadius: "46px",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "inherit",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          clipPath: scrolled
            ? "ellipse(50px 30px at top center)"
            : "ellipse(100% 100% at top center)",
        },
        "& .MuiToolbar-root": {
          height: "100%",
          minHeight: "unset",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: scrolled ? 0 : 1,
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Toolbar
          disableGutters
          sx={{ height: "100%", justifyContent: "center" }}
        >
          <>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              InvitArte
            </Typography>
            <Button color="inherit" component={StyledNavLink} to="/guests">
              Invitados
            </Button>
            <Button color="inherit" component={StyledNavLink} to="/tags">
              Etiquetas
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Desconectarse
            </Button>
          </>
        </Toolbar>
      </Container>
    </AnimatedAppBar>
  );
};

export default Navbar;
