// ConfirmationForm.JSX
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
  Checkbox,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import "../../styles/fonts.css";
import services from "../../services/Api";

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiFormLabel-root": {
    color: "#b83c8e",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: "#b83c8e",
    },
  },
  "& .MuiRadio-root": {
    color: "#f5a9d0",
    padding: "12px",
    "&.Mui-checked": {
      color: "#b83c8e",
    },
  },
  "& .MuiFormControlLabel-label": {
    color: "#b83c8e",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputBase-root": {
    color: "#b83c8e",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&:before": {
      borderBottomColor: "rgba(184, 60, 142, 0.5)",
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#b83c8e",
    },
    "&.Mui-focused:after": {
      borderBottomColor: "#b83c8e",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 0",
    WebkitAppearance: "none",
    borderRadius: 0,
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 30px #ffffff inset !important",
      WebkitTextFillColor: "#b83c8e !important",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(184, 60, 142, 0.7)",
    fontFamily: "'Prata', serif",
    fontSize: "16px",
    "&.Mui-focused": {
      color: "#b83c8e",
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
    color: "#f5a9d0",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: "#b83c8e",
  },
});

const CustomCheck = styled(Checkbox)({
  "&.MuiRadio-root": {
    color: "#f5a9d0",
    padding: "12px",
  },
  "&.Mui-checked": {
    color: "#b83c8e",
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
      needs_transport: false,
      needs_hotel: false,
      menu_id: "",
      allergy_ids: [],
      honeypot: false,
    },
    plus_one: {
      first_name: "",
      last_name: "",
      menu_id: "",
      allergy_ids: [],
    },
    hasPlusOne: "no",
  });

  const [menus, setMenus] = useState([]);
  const [allergies, setAllergies] = useState([]);

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

  useEffect(() => {
    const loadMenusAndAllergies = async () => {
      try {
        const [menusData, allergiesData] = await Promise.all([
          services.public.getPublicMenus(),
          services.public.getPublicAllergies(),
        ]);
        setMenus(menusData);
        setAllergies(allergiesData);
      } catch (error) {
        console.error("Error loading menus or allergies:", error);
      }
    };

    loadMenusAndAllergies();
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
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      guest: {
        ...prevData.guest,
        [name]: checked,
      },
    }));
  }, []);

  const handlePlusOneChange = useCallback((e) => {
    setFormData((prevData) => ({
      ...prevData,
      hasPlusOne: e.target.value,
    }));
  }, []);

  const handleAllergyChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      guest: {
        ...prevData.guest,
        allergy_ids: newValue.map((allergy) => allergy.id),
      },
    }));
  }, []);

  const handlePlusOneAllergyChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      plus_one: {
        ...prevData.plus_one,
        allergy_ids: newValue.map((allergy) => allergy.id),
      },
    }));
  }, []);

  const handlePlusOneMenuChange = useCallback((e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      plus_one: {
        ...prevData.plus_one,
        menu_id: value,
      },
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
      {/* campos invitado */}
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

      {/* transporte */}
      <Grid item xs={12}>
        <CustomFormControl>
          <FormControlLabel
            control={
              <CustomCheck
                checked={formData.guest.needs_transport}
                onChange={handleCheckboxChange}
                name="needs_transport"
              />
            }
            label="¿Necesita transporte?"
          />
        </CustomFormControl>
      </Grid>

      {/* hotel */}
      <Grid item xs={12}>
        <CustomFormControl>
          <FormControlLabel
            control={
              <CustomCheck
                checked={formData.guest.needs_hotel}
                onChange={handleCheckboxChange}
                name="needs_hotel"
              />
            }
            label="¿Necesita hotel?"
          />
        </CustomFormControl>
      </Grid>

      {/* menu del invitado */}
      <Grid item xs={12}>
        <CustomTextField
          select
          fullWidth
          label="Seleccione el menú"
          name="menu_id"
          value={formData.guest.menu_id}
          onChange={(e) => handleInputChange(e, "guest")}
          required
          variant="standard"
          error={!!formErrors.menu_id}
          helperText={formErrors.menu_id}
        >
          {menus.map((menu) => (
            <MenuItem key={menu.id} value={menu.id}>
              {menu.name}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      {/* alergias invitado */}
      <Grid item xs={12}>
        <Autocomplete
          multiple
          id="allergies-select"
          options={allergies}
          getOptionLabel={(option) => option.name}
          value={allergies.filter((allergy) =>
            formData.guest.allergy_ids.includes(allergy.id)
          )}
          onChange={handleAllergyChange}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Seleccione las alergias"
              variant="standard"
              error={!!formErrors.allergy_ids}
              helperText={formErrors.allergy_ids}
            />
          )}
        />
      </Grid>
      {/* HONEYPOT */}
      <Grid item xs={12} sx={{ display: "none" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.guest.honeypot}
              onChange={(e) => handleInputChange(e, "guest")}
              name="honeypot"
            />
          }
          label="¿Eres humano?"
        />
      </Grid>

      {/* elegir acompañante */}
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

      {/* menu del acompañante */}
      {formData.hasPlusOne === "yes" && (
        <Grid item xs={12}>
          <CustomTextField
            select
            fullWidth
            label="Seleccione el menú del acompañante"
            name="menu_id"
            value={formData.plus_one.menu_id}
            onChange={handlePlusOneMenuChange}
            required
            variant="standard"
            error={!!formErrors.plus_one_menu_id}
            helperText={formErrors.plus_one_menu_id}
          >
            {menus.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      )}

      {/* alergias acompañante */}
      {formData.hasPlusOne === "yes" && (
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="plus-one-allergies-select"
            options={allergies}
            getOptionLabel={(option) => option.name}
            value={allergies.filter((allergy) =>
              formData.plus_one.allergy_ids.includes(allergy.id)
            )}
            onChange={handlePlusOneAllergyChange}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Seleccione las alergias del acompañante"
                variant="standard"
                error={!!formErrors.plus_one_allergy_ids}
                helperText={formErrors.plus_one_allergy_ids}
              />
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};

ConfirmationForm.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  onValidationChange: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  initialData: PropTypes.object,
};

export default ConfirmationForm;
