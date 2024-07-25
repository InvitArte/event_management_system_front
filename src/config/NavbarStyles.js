import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { AppBar } from "@mui/material";
import { NavLink } from "react-router-dom";

const BOUNCE_IN_ANIMATION = keyframes`
  0% { transform: translateY(-100%); }
  50% { transform: translateY(8%); }
  65% { transform: translateY(-4%); }
  80% { transform: translateY(4%); }
  95% { transform: translateY(-2%); }
  100% { transform: translateY(0); }
`;

const TRANSITION = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";

export const AnimatedAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "isScrolled",
})(({ theme, isScrolled }) => ({
  animation: `${BOUNCE_IN_ANIMATION} 1.2s ease-out`,
  transition: TRANSITION,
  transformOrigin: "top center",
  width: isScrolled ? "100px" : "90%",
  left: isScrolled ? "calc(50% - 50px)" : "5%",
  height: isScrolled ? "30px" : "64px",
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
    transition: TRANSITION,
    clipPath: isScrolled
      ? "ellipse(50px 30px at top center)"
      : "ellipse(100% 100% at top center)",
  },
  "& .MuiToolbar-root": {
    height: "100%",
    minHeight: "unset",
    transition: TRANSITION,
    opacity: isScrolled ? 0 : 1,
    position: "relative",
    zIndex: 1,
  },
  "&:hover": {
    width: "90% !important",
    left: "5% !important",
    height: "64px !important",
    "& .MuiToolbar-root": {
      opacity: "1 !important",
    },
  },
}));

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  "&.active": {
    fontWeight: "bold",
    textDecoration: "underline",
  },
}));
