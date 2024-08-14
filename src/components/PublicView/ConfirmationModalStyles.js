import { styled } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  FormControl,
  Radio,
} from "@mui/material";

// Estilos existentes del modal
export const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#231f20",
    borderRadius: "15px",
    color: "white",
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
  color: "white",
  fontFamily: "'Prata', serif",
  fontSize: "22px",
  padding: "0 40px 8px",
  textAlign: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
}));

export const CustomDialogContent = styled(DialogContent)({
  color: "white",
  fontFamily: "'Prata', serif",
  paddingTop: "16px",
  WebkitOverflowScrolling: "touch",
});

export const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#a3a3a3",
  color: "white",
  border: "none",
  padding: "12px 24px",
  fontSize: "16px",
  borderRadius: "5px",
  cursor: "pointer",
  boxShadow: "2px 2px 4px rgba(49, 49, 49, 0.5)",
  margin: "1rem auto",
  transition: "background-color 0.3s ease",
  fontFamily: "'Prata', serif",
  minWidth: "200px",
  WebkitTapHighlightColor: "transparent",
  "&:hover": {
    backgroundColor: "#868686",
  },
  "&:disabled": {
    backgroundColor: "#4a4a4a",
    color: "#8a8a8a",
    cursor: "not-allowed",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    padding: "10px 20px",
    minWidth: "160px",
  },
}));

export const CloseButton = styled(IconButton)({
  position: "absolute",
  right: 8,
  top: 8,
  color: "white",
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
  color: "white",
  fontFamily: "'Prata', serif",
  textAlign: "center",
  marginBottom: "24px",
  fontSize: "18px",
});

export const ErrorMessage = styled("p")({
  color: "#ff6b6b",
  fontFamily: "'Prata', serif",
  textAlign: "center",
  marginBottom: "16px",
  fontSize: "14px",
});

// Nuevos estilos del formulario
export const CustomFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    color: "white",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "& .MuiRadio-root": {
    color: "white",
    padding: "12px",
    "&.Mui-checked": {
      color: "white",
    },
  },
  "& .MuiFormControlLabel-label": {
    color: "white",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
  },
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputBase-root": {
    color: "white",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&:before": {
      borderBottomColor: "rgba(255, 255, 255, 0.5)",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "white",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 0",
    WebkitAppearance: "none",
    borderRadius: 0,
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 30px #231f20 inset !important",
      WebkitTextFillColor: "white !important",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#ff6b6b",
    fontFamily: "'Prata', serif",
    fontSize: "14px",
    marginTop: "4px",
  },
}));

export const CustomRadio = styled(Radio)({
  "&.MuiRadio-root": {
    color: "white",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: "white",
  },
});
