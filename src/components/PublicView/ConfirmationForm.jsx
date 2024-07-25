import React, { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  styled,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import "../../styles/fonts.css";

const CustomFormControl = styled(FormControl)({
  "& .MuiFormLabel-root": {
    color: "white",
    fontFamily: "'Prata', serif",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "& .MuiRadio-root": {
    color: "white",
    "&.Mui-checked": {
      color: "white",
    },
  },
  "& .MuiFormControlLabel-label": {
    color: "white",
    fontFamily: "'Prata', serif",
  },
});

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    color: "white",
    fontFamily: "'Prata', serif",
    "&:before": {
      borderBottomColor: "white",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "white",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "white",
    },
  },
  "& .MuiInputBase-input": {
    color: "white",
    fontFamily: "'Prata', serif",
  },
  "& .MuiInputLabel-root": {
    color: "white",
    fontFamily: "'Prata', serif",
    "&.Mui-focused": {
      color: "white",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#ff6b6b",
    fontFamily: "'Prata', serif",
  },
});

const CustomRadio = styled(Radio)({
  "&.MuiRadio-root": {
    color: "white",
  },
  "&.Mui-checked": {
    color: "white",
  },
});

const ConfirmationForm = ({ onFormChange, onValidationChange, formErrors }) => {
  const [formData, setFormData] = useState({
    guest: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
    plus_one: {
      first_name: "",
      last_name: "",
    },
    hasPlusOne: "no",
  });

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  useEffect(() => {
    const isValid = !Object.values(formErrors).some((error) => error !== "");
    onValidationChange(isValid);
  }, [formErrors, onValidationChange]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handlePlusOneChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      hasPlusOne: e.target.value,
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Nombre"
          name="first_name"
          value={formData.guest.first_name}
          onChange={(e) => handleInputChange(e, "guest")}
          required
          variant="standard"
          error={!!formErrors.first_name}
          helperText={formErrors.first_name}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Apellido"
          name="last_name"
          value={formData.guest.last_name}
          onChange={(e) => handleInputChange(e, "guest")}
          required
          variant="standard"
          error={!!formErrors.last_name}
          helperText={formErrors.last_name}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={formData.guest.phone}
          onChange={(e) => handleInputChange(e, "guest")}
          required
          variant="standard"
          error={!!formErrors.phone}
          helperText={formErrors.phone}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomTextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.guest.email}
          onChange={(e) => handleInputChange(e, "guest")}
          required
          variant="standard"
          error={!!formErrors.email}
          helperText={formErrors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <CustomFormControl>
          <FormLabel>¿Vienes acompañado?</FormLabel>
          <RadioGroup
            row
            name="hasPlusOne"
            value={formData.hasPlusOne}
            onChange={handlePlusOneChange}
          >
            <FormControlLabel
              value="yes"
              control={<CustomRadio />}
              label="Sí"
            />
            <FormControlLabel value="no" control={<CustomRadio />} label="No" />
          </RadioGroup>
        </CustomFormControl>
      </Grid>
      {formData.hasPlusOne === "yes" && (
        <>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="Nombre del acompañante"
              name="first_name"
              value={formData.plus_one.first_name}
              onChange={(e) => handleInputChange(e, "plus_one")}
              required
              variant="standard"
              error={!!formErrors.plus_one_first_name}
              helperText={formErrors.plus_one_first_name}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label="Apellido del acompañante"
              name="last_name"
              value={formData.plus_one.last_name}
              onChange={(e) => handleInputChange(e, "plus_one")}
              required
              variant="standard"
              error={!!formErrors.plus_one_last_name}
              helperText={formErrors.plus_one_last_name}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ConfirmationForm;
