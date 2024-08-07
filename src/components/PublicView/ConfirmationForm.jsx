import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
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

const CustomFormControl = styled(FormControl)(({ theme }) => ({
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

const CustomTextField = styled(TextField)(({ theme }) => ({
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

const CustomRadio = styled(Radio)({
  "&.MuiRadio-root": {
    color: "white",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: "white",
  },
});

const ConfirmationForm = ({
  onFormChange,
  onValidationChange,
  formErrors,
  initialData = null,
}) => {
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
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  useEffect(() => {
    const isValid = !Object.values(formErrors).some((error) => error !== "");
    onValidationChange(isValid);
  }, [formErrors, onValidationChange]);

  const handleInputChange = useCallback((e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  }, []);

  const handlePlusOneChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      hasPlusOne: e.target.value,
    }));
  }, []);

  const guestFields = useMemo(
    () => [
      {
        name: "first_name",
        label: "Nombre",
        type: "text",
        autoCapitalize: "words",
      },
      {
        name: "last_name",
        label: "Apellido",
        type: "text",
        autoCapitalize: "words",
      },
      { name: "phone", label: "Teléfono", type: "tel", inputMode: "tel" },
      {
        name: "email",
        label: "Email",
        type: "email",
        inputMode: "email",
        autoCapitalize: "none",
      },
    ],
    []
  );

  const plusOneFields = useMemo(
    () => [
      {
        name: "first_name",
        label: "Nombre del acompañante",
        type: "text",
        autoCapitalize: "words",
      },
      {
        name: "last_name",
        label: "Apellido del acompañante",
        type: "text",
        autoCapitalize: "words",
      },
    ],
    []
  );

  return (
    <Grid container spacing={2}>
      {guestFields.map((field) => (
        <Grid item xs={12} key={field.name}>
          <CustomTextField
            fullWidth
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData.guest[field.name]}
            onChange={(e) => handleInputChange(e, "guest")}
            required
            variant="standard"
            error={!!formErrors[field.name]}
            helperText={formErrors[field.name]}
            inputProps={{
              autoCapitalize: field.autoCapitalize,
              autoCorrect: "off",
              inputMode: field.inputMode,
            }}
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <CustomFormControl component="fieldset">
          <FormLabel component="legend">¿Vienes acompañado?</FormLabel>
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
      {formData.hasPlusOne === "yes" &&
        plusOneFields.map((field) => (
          <Grid item xs={12} key={field.name}>
            <CustomTextField
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData.plus_one[field.name]}
              onChange={(e) => handleInputChange(e, "plus_one")}
              required
              variant="standard"
              error={!!formErrors[`plus_one_${field.name}`]}
              helperText={formErrors[`plus_one_${field.name}`]}
              inputProps={{
                autoCapitalize: field.autoCapitalize,
                autoCorrect: "off",
              }}
            />
          </Grid>
        ))}
    </Grid>
  );
};

ConfirmationForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  onValidationChange: PropTypes.func.isRequired,
  formErrors: PropTypes.objectOf(PropTypes.string).isRequired,
  initialData: PropTypes.shape({
    guest: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    plus_one: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    hasPlusOne: PropTypes.string,
  }),
};

export default React.memo(ConfirmationForm);
