// Material-UI
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  FormControl,
  Radio,
  Checkbox,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Definir el color azul principal
const mainBlue = "#8D5444";
const darkBlue = " #774436";
const silver = "#C0C0C0";

// Estilos del modal
export const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "white",
    borderRadius: "15px",
    color: "#231f20",
    fontFamily: "'Prata', serif",
    position: "relative",
    padding: "24px 24px 16px",
    WebkitOverflowScrolling: "touch",
    maxWidth: "100%",
    width: "100%",
    margin: "10px",
    [theme.breakpoints.up("sm")]: {
      maxWidth: "500px",
      width: "calc(100% - 64px)",
      margin: "32px",
    },
  },
}));

export const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: "#231f20",
  fontFamily: "'CormorantUpright', regular",
  fontSize: "32px",
  padding: "0 40px 8px",
  textAlign: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    fontSize: "28px",
  },
}));

export const CustomDialogContent = styled(DialogContent)({
  color: "#231f20",
  fontFamily: "'Prata', serif",
  fontSize: "16px",
  paddingTop: "16px",
  WebkitOverflowScrolling: "touch",
});

export const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: mainBlue,
  color: "white",
  border: "none",
  padding: "12px 24px",
  fontSize: "18px",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "rgba(119, 68, 54, 0.3)",
  margin: "1rem auto",
  transition: "all 0.3s ease",
  fontFamily: "'CormorantUpright', regular",
  minWidth: "200px",
  WebkitTapHighlightColor: "transparent",
  "&:hover": {
    backgroundColor: darkBlue,
    transform: "translateY(-2px)",
    boxShadow: " rgba(119, 68, 54, 0.4)",
  },
  "&:disabled": {
    backgroundColor: "#b3d7ff",
    color: "#ffffff",
    cursor: "not-allowed",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
    padding: "10px 20px",
    minWidth: "160px",
  },
}));

export const CloseButton = styled(IconButton)({
  position: "absolute",
  right: 8,
  top: 8,
  color: "#231f20",
  WebkitTapHighlightColor: "transparent",
  padding: "12px",
});

export const ImageContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginTop: "16px",
  marginBottom: "24px",
});

export const StyledImage = styled("img")({
  width: "80px",
  height: "auto",
});

export const SuccessMessage = styled("p")({
  color: "#231f20",
  fontFamily: "'CormorantUpright', regular",
  textAlign: "center",
  marginBottom: "24px",
  fontSize: "24px",
});

export const ErrorMessage = styled("p")({
  color: "#ff6b6b",
  fontFamily: "'Prata', serif",
  textAlign: "center",
  marginBottom: "16px",
  fontSize: "14px",
});

// Estilos del formulario
export const CustomFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    color: "#231f20",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: mainBlue,
    },
  },
  "& .MuiRadio-root": {
    color: "#231f20",
    padding: "12px",
    "&.Mui-checked": {
      color: mainBlue,
    },
  },
  "& .MuiFormControlLabel-label": {
    color: "#231f20",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
  },
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputBase-root": {
    color: "#231f20",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&:before": {
      borderBottomColor: "rgba(35, 31, 32, 0.5)",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: mainBlue,
    },
    "&.Mui-focused:after": {
      borderBottomColor: mainBlue,
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 0",
    WebkitAppearance: "none",
    borderRadius: 0,
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 30px white inset !important",
      WebkitTextFillColor: "#231f20 !important",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(35, 31, 32, 0.7)",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: mainBlue,
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#ff6b6b",
    fontFamily: "'Prata', serif",
    fontSize: "12px",
    marginTop: "4px",
  },
}));

export const CustomRadio = styled(Radio)({
  "&.MuiRadio-root": {
    color: "#231f20",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: mainBlue,
  },
});

export const CustomCheck = styled(Checkbox)({
  "&.MuiCheckbox-root": {
    color: "#231f20",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: mainBlue,
  },
});

// Estilos para EventCard
export const CustomCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  background: "linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)",
}));

export const CustomCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const EventSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.8rem",
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: "-0.00833em",
  marginBottom: theme.spacing(1),
  color: mainBlue,
  textAlign: "center",
  fontFamily: "'CormorantUpright', regular",
}));

export const EventTitleStyle = styled(Typography)(({ theme }) => ({
  fontSize: "3.8rem",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.01562em",
  marginBottom: theme.spacing(3),
  color: mainBlue,
  textAlign: "center",
  fontFamily: "'CormorantUpright', regular",
}));

export const EventInfo = styled("div")(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  // borderRadius: theme.shape.borderRadius,
  backgroundColor: "transparent",
  // boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
}));

export const EventButton = styled(Button)(({ theme }) => ({
  alignItems: "center",
  appearance: "none",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  borderRadius: "24px",
  borderStyle: "none",
  boxShadow:
    "rgba(141, 84, 68, 0.2) 0 3px 5px -1px, rgba(141, 84, 68, 0.14) 0 6px 10px 0, rgba(141, 84, 68, 0.12) 0 1px 18px 0",
  boxSizing: "border-box",
  color: mainBlue,
  cursor: "pointer",
  display: "inline-flex",
  fill: "currentcolor",
  fontFamily: "'CormorantUpright', regular",
  fontSize: "20px",
  fontWeight: 500,
  height: "48px",
  justifyContent: "center",
  letterSpacing: ".25px",
  lineHeight: "normal",
  maxWidth: "100%",
  overflow: "visible",
  padding: "2px 24px",
  position: "relative",
  textAlign: "center",
  textTransform: "none",
  transition:
    "box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  width: "auto",
  willChange: "transform, opacity",
  zIndex: 0,

  "&:hover": {
    backgroundColor: "#F6F9FE",
    color: mainBlue,
    boxShadow: `rgba(141, 84, 68, 0.3) 0 2px 3px 0, rgba(141, 84, 68, 0.15) 0 6px 10px 4px`,
  },

  "&:focus": {
    outline: "none",
    border: `2px solid ${mainBlue}`,
    boxShadow: `rgba(141, 84, 68, 0.3) 0 1px 3px 0, rgba(141, 84, 68, 0.15) 0 4px 8px 3px`,
  },

  "&:active": {
    boxShadow: `0 4px 4px 0 rgba(141, 84, 68, 0.3), 0 8px 12px 6px rgba(141, 84, 68, 0.15)`,
    outline: "none",
  },

  "&:disabled": {
    boxShadow: `rgba(141, 84, 68, 0.3) 0 1px 3px 0, rgba(141, 84, 68, 0.15) 0 4px 8px 3px`,
    color: "rgba(0, 0, 0, .38)",
  },

  [theme.breakpoints.up("sm")]: {
    fontSize: "22px",
    height: "56px",
    padding: "2px 32px",
  },
}));

export const InvertedEventButton = styled(Button)(({ theme }) => ({
  backgroundColor: `${mainBlue} !important`,
  color: "#ffffff !important",
  border: "none !important",
  borderRadius: "24px !important",
  padding: "12px 24px !important",
  fontSize: "20px !important",
  textTransform: "none !important",
  fontFamily: "'CormorantUpright', regular !important",
  cursor: "pointer !important",
  boxShadow: "2px 2px 4px rgba(141, 84, 68, 0.3) !important",
  transition: "all 0.3s ease !important",
  minWidth: "200px !important",
  "&:hover": {
    backgroundColor: `${darkBlue} !important`,
    transform: "translateY(-2px) !important",
    boxShadow: "0 4px 8px rgba(141, 84, 68, 0.4) !important",
  },
  "&:disabled": {
    backgroundColor: "rgba(141, 84, 68, 0.5) !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    cursor: "not-allowed !important",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px !important",
    padding: "10px 20px !important",
    minWidth: "160px !important",
  },
}));
// Estilos para CountdownTimer
export const StyledCountdown = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

export const TimeUnit = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const TimeValue = styled(Typography)(({ theme }) => ({
  fontSize: "3.2rem",
  fontWeight: 700,
  color: mainBlue,
  fontFamily: "'CormorantUpright', regular",
}));

export const TimeLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem",
  color: theme.palette.text.secondary,
  fontFamily: "'CormorantUpright', regular",
}));

// Estilos para GiftMessage
export const StyledGiftMessage = styled("div")(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(2),
  // borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  // boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
}));

export const GiftMessageText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontStyle: "italic",
  fontFamily: "'CormorantUpright', regular",
  fontSize: "1.7rem",
}));

export const AccountNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: mainBlue,
  fontFamily: "'CormorantUpright', regular",
  fontSize: "2rem",
}));

// Nuevos estilos para EventDate y CalendarButton
export const EventDateTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'CormorantUpright', regular",
  fontSize: "1.7rem",
  color: mainBlue,
  textAlign: "center",
}));

export const CalendarButtonStyled = styled(Button)(({ theme }) => ({
  fontFamily: "'CormorantUpright', regular",
  fontSize: "1.4rem",
  backgroundColor: mainBlue,
  color: "white",
  "&:hover": {
    backgroundColor: darkBlue,
  },
}));

// Nuevos estilos para EventTimeline
export const TimelineContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: "2px",
    backgroundColor: mainBlue,
    transform: "translateX(-50%)",
  },
}));

export const TimelineEvent = styled("div")(({ theme }) => ({
  position: "relative",
  marginBottom: theme.spacing(4),
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "20px",
    height: "20px",
    backgroundColor: mainBlue,
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

export const TimelineEventContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  maxWidth: "80%",
  [theme.breakpoints.up("md")]: {
    width: "45%",
  },
}));

export const TimelineEventTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'CormorantUpright', regular",
  fontSize: "2rem",
  color: mainBlue,
  marginBottom: theme.spacing(1),
}));

export const TimelineEventDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "'Prata', serif",
  fontSize: "1.2rem",
}));

// Nuevo Botón
export const ElegantButton = styled(Button)(({ theme, inverted = false }) => ({
  outline: 0,
  gridGap: '8px',
  alignItems: 'center',
  background: inverted ? mainBlue : 'transparent',
  border: `1px solid ${inverted ? '#ffffff' : mainBlue}`,
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'inline-flex',
  flexShrink: 0,
  fontSize: '16px',
  gap: '8px',
  justifyContent: 'center',
  lineHeight: 1.5,
  overflow: 'hidden',
  padding: '12px 16px',
  textDecoration: 'none',
  textOverflow: 'ellipsis',
  transition: 'all .14s ease-out',
  whiteSpace: 'nowrap',
  color: inverted ? '#ffffff' : mainBlue,
  fontFamily: "'CormorantUpright', regular",
  '&:hover': {
    boxShadow: `4px 4px 0 ${inverted ? darkBlue : '#ffffff'}`,
    transform: 'translate(-4px,-4px)',
    color: inverted ? darkBlue : '#ffffff',
    background: inverted ? '#ffffff' : mainBlue,
  },
  '&:focus-visible': {
    outlineOffset: '1px',
  },
  '&:disabled': {
    backgroundColor: 'rgba(141, 84, 68, 0.5)',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'not-allowed',
    '&:hover': {
      boxShadow: 'none',
      transform: 'none',
      color: 'rgba(255, 255, 255, 0.7)',
      background: 'rgba(141, 84, 68, 0.5)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    padding: '10px 14px',
  },
}));

// Exportar los colores para su uso en otros componentes
export { mainBlue, darkBlue, silver };
