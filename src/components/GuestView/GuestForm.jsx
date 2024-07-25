import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
  Autocomplete,
} from "@mui/material";

const PlusOneForm = ({
  plusOne,
  index,
  handlePlusOneChange,
  menus,
  allergies,
  visibleFormFields,
  removePlusOne,
}) => (
  <Grid container item xs={12} spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h6">Acompañante {index + 1}</Typography>
    </Grid>
    {visibleFormFields.plus_one_first_name && (
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nombre"
          name="first_name"
          value={plusOne.first_name}
          onChange={(e) =>
            handlePlusOneChange(index, "first_name", e.target.value)
          }
          required
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      </Grid>
    )}
    {visibleFormFields.plus_one_last_name && (
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Apellido"
          name="last_name"
          value={plusOne.last_name}
          onChange={(e) =>
            handlePlusOneChange(index, "last_name", e.target.value)
          }
          required
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      </Grid>
    )}
    {visibleFormFields.plus_one_menu && (
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={menus}
          getOptionLabel={(option) => option.name}
          value={plusOne.menu}
          onChange={(event, newValue) =>
            handlePlusOneChange(index, "menu", newValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Menú"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Grid>
    )}
    {visibleFormFields.plus_one_allergy && (
      <Grid item xs={12} sm={4}>
        <Autocomplete
          options={allergies}
          getOptionLabel={(option) => option.name}
          value={plusOne.allergy}
          onChange={(event, newValue) =>
            handlePlusOneChange(index, "allergy", newValue)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Alergia"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Grid>
    )}
    {visibleFormFields.plus_one_disability && (
      <Grid item xs={12} sm={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={plusOne.disability}
              onChange={(e) =>
                handlePlusOneChange(index, "disability", e.target.checked)
              }
              name="disability"
            />
          }
          label="Tiene discapacidad"
        />
      </Grid>
    )}
    <Grid item xs={12}>
      <Button
        onClick={() => removePlusOne(index)}
        color="secondary"
        variant="outlined"
        fullWidth
      >
        Eliminar Acompañante
      </Button>
    </Grid>
  </Grid>
);

const GuestForm = ({
  guest,
  onSubmit,
  menus,
  allergies,
  visibleFormFields,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    needs_transport: false,
    needs_hotel: false,
    disability: false,
    menu: null,
    allergy: null,
    observations: "",
    accommodation_plan: "",
    plus_ones: [],
  });
  const [showPlusOne, setShowPlusOne] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        ...guest,
        menu: menus.find((m) => m.id === guest.menu_id) || null,
        allergy: allergies.find((a) => a.id === guest.allergy_id) || null,
        plus_ones: guest.plus_ones.map((po) => ({
          ...po,
          menu: menus.find((m) => m.id === po.menu_id) || null,
          allergy: allergies.find((a) => a.id === po.allergy_id) || null,
        })),
      });
      setShowPlusOne(guest.plus_ones && guest.plus_ones.length > 0);
    }
  }, [guest, menus, allergies]);

  const handleChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleAutocompleteChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handlePlusOneChange = useCallback((index, name, value) => {
    setFormData((prevData) => {
      const newPlusOnes = [...prevData.plus_ones];
      newPlusOnes[index] = {
        ...newPlusOnes[index],
        [name]: value,
      };
      return { ...prevData, plus_ones: newPlusOnes };
    });
  }, []);

  const addPlusOne = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      plus_ones: [
        ...prevData.plus_ones,
        {
          first_name: "",
          last_name: "",
          menu: null,
          allergy: null,
          disability: false,
        },
      ],
    }));
    setShowPlusOne(true);
  }, []);

  const removePlusOne = useCallback(
    (index) => {
      setFormData((prevData) => ({
        ...prevData,
        plus_ones: prevData.plus_ones.filter((_, i) => i !== index),
      }));
      setShowPlusOne((prev) => formData.plus_ones.length > 1 || !prev);
    },
    [formData.plus_ones.length]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const submitData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        needs_transport: formData.needs_transport,
        needs_hotel: formData.needs_hotel,
        disability: formData.disability,
        menu_id: formData.menu?.id || null,
        allergy_id: formData.allergy?.id || null,
        observations: formData.observations || "",
        accommodation_plan: formData.accommodation_plan || "",
        plus_ones: formData.plus_ones.map((plusOne) => ({
          first_name: plusOne.first_name,
          last_name: plusOne.last_name,
          menu_id: plusOne.menu?.id || null,
          allergy_id: plusOne.allergy?.id || null,
          disability: plusOne.disability,
        })),
      };

      onSubmit(submitData);
    },
    [formData, onSubmit]
  );

  const renderFormField = useCallback(
    (fieldName, component) => {
      return visibleFormFields[fieldName] && component;
    },
    [visibleFormFields]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {renderFormField(
          "first_name",
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "last_name",
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "phone",
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "email",
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "menu",
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={menus}
              getOptionLabel={(option) => option.name}
              value={formData.menu}
              onChange={(event, newValue) =>
                handleAutocompleteChange("menu", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Menú"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        )}
        {renderFormField(
          "allergy",
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={allergies}
              getOptionLabel={(option) => option.name}
              value={formData.allergy}
              onChange={(event, newValue) =>
                handleAutocompleteChange("allergy", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Alergia"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {renderFormField(
              "needs_transport",
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.needs_transport}
                      onChange={handleChange}
                      name="needs_transport"
                    />
                  }
                  label="Necesita transporte"
                />
              </Grid>
            )}
            {renderFormField(
              "needs_hotel",
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.needs_hotel}
                      onChange={handleChange}
                      name="needs_hotel"
                    />
                  }
                  label="Necesita hotel"
                />
              </Grid>
            )}
            {renderFormField(
              "disability",
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.disability}
                      onChange={handleChange}
                      name="disability"
                    />
                  }
                  label="Tiene discapacidad"
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {renderFormField(
          "observations",
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "accommodation_plan",
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plan de alojamiento"
              name="accommodation_plan"
              value={formData.accommodation_plan}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
        )}
        {renderFormField(
          "plus_ones",
          <>
            <Grid item xs={12}>
              <Button onClick={addPlusOne} variant="outlined" color="primary">
                Añadir Acompañante
              </Button>
            </Grid>
            {showPlusOne &&
              formData.plus_ones.map((plusOne, index) => (
                <PlusOneForm
                  key={index}
                  plusOne={plusOne}
                  index={index}
                  handlePlusOneChange={handlePlusOneChange}
                  menus={menus}
                  allergies={allergies}
                  visibleFormFields={visibleFormFields}
                  removePlusOne={removePlusOne}
                />
              ))}
          </>
        )}
        <button
          type="submit"
          id="guest-form-submit"
          style={{ display: "none" }}
        />
      </Grid>
    </form>
  );
};

export default GuestForm;
