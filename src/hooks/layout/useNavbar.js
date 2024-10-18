// hooks de react
import { useState, useEffect, useCallback } from "react";

// Biblioteca de terceros
import { useNavigate } from "react-router-dom";

// Servicios
import { authService } from "../../services/Api";

const useNavbar = (threshold) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    isScrolled,
    setIsScrolled,
    anchorEl,
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
  };
};

export default useNavbar;