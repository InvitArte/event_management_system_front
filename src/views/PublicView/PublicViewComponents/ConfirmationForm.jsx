import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import {
  CustomFormControl,
  CustomTextField,
  CustomRadio,
} from "../../CarmenView/CarmenViewComponents/ConfirmationModalStyles";
import "../../../styles/fonts.css";

const initialFormData = {
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
};

const ConfirmationForm = ({
  onFormChange,
  onValidationChange,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [touchedFields, setTouchedFields] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    onFormChange(formData);
    const errors = validateForm(formData, touchedFields);
    setFormErrors(errors);
    onValidationChange(Object.keys(errors).length === 0);
  }, [formData, touchedFields, onFormChange, onValidationChange]);

  const validateForm = useCallback((data, touched) => {
    const errors = {};
    const { guest, plus_one, hasPlusOne } = data;

    const validateField = (section, field, message) => {
      if (!data[section][field] && touched[`${section}.${field}`]) {
        errors[`${section}.${field}`] = message;
      }
    };

    validateField("guest", "first_name", "El nombre es requerido");
    validateField("guest", "last_name", "El apellido es requerido");
    validateField("guest", "phone", "El teléfono es requerido");
    validateField("guest", "email", "El email es requerido");

    if (hasPlusOne === "yes") {
      validateField(
        "plus_one",
        "first_name",
        "El nombre del acompañante es requerido"
      );
      validateField(
        "plus_one",
        "last_name",
        "El apellido del acompañante es requerido"
      );
    }

    return errors;
  }, []);

  const handleInputChange = useCallback((e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
    setTouchedFields((prev) => ({ ...prev, [`${section}.${name}`]: true }));
  }, []);

  const handlePlusOneChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      hasPlusOne: e.target.value,
    }));
  }, []);

  const renderTextField = useCallback(
    (field, section) => (
      <Grid item xs={12} key={field.name}>
        <CustomTextField
          fullWidth
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[section][field.name]}
          onChange={(e) => handleInputChange(e, section)}
          onBlur={() =>
            setTouchedFields((prev) => ({
              ...prev,
              [`${section}.${field.name}`]: true,
            }))
          }
          required
          variant="standard"
          error={!!formErrors[`${section}.${field.name}`]}
          helperText={formErrors[`${section}.${field.name}`]}
          inputProps={{
            autoCapitalize: field.autoCapitalize,
            autoCorrect: "off",
            inputMode: field.inputMode,
          }}
        />
      </Grid>
    ),
    [formData, formErrors, handleInputChange]
  );

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
      {guestFields.map((field) => renderTextField(field, "guest"))}
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
        plusOneFields.map((field) => renderTextField(field, "plus_one"))}
    </Grid>
  );
};

ConfirmationForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  onValidationChange: PropTypes.func.isRequired,
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

const MemoizedConfirmationForm = React.memo(ConfirmationForm);
export default MemoizedConfirmationForm;