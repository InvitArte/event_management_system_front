import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/Api";

export const useScrollDetection = (threshold) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > threshold;
      setIsScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isScrolled };
};

export const useUserMenu = (navigate) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      handleMenuClose();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  return {
    anchorEl,
    isMenuOpen: Boolean(anchorEl),
    handleMenuOpen,
    handleMenuClose,
    handleLogout,
  };
};
