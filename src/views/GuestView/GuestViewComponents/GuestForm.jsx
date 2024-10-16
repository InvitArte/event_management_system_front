//React y hooks
import React, { useState, useEffect, useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Autocomplete,
} from "@mui/material";


// Componentes genericos
import { TagChip } from "../../../components";

// Componentes propios
import {TagsInput, PlusOneForm} from './index';


const GuestForm = ({
  guest,
  onSubmit,
  menus,
  allergies,
  tags,
  visibleFormFields,
  onOpenTagModal,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    needs_transport: false,
    needs_transport_back: false,
    needs_hotel: false,
    disability: false,
    menu: null,
    allergies: [],
    observations: "",
    accommodation_plan: "",
    plus_ones: [],
    tags: [],
  });
  const [showPlusOne, setShowPlusOne] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        first_name: guest.first_name ?? "",
        last_name: guest.last_name ?? "",
        phone: guest.phone ?? "",
        email: guest.email ?? "",
        needs_transport: guest.needs_transport ?? false,
        needs_transport_back: guest.needs_transport_back ?? false,
        needs_hotel: guest.needs_hotel ?? false,
        disability: guest.disability ?? false,
        menu: menus.find((m) => m.id === guest.menu_id) ?? null,
        allergies: guest.allergies ?? [],
        observations: guest.observations ?? "",
        accommodation_plan: guest.accommodation_plan ?? "",
        tags: guest.tags ?? [],
        plus_ones: guest.plus_ones?.map((po) => ({
          ...po,
          menu: menus.find((m) => m.id === po.menu_id) ?? null,
          allergies: po.allergies ?? [],
          observations: po.observations ?? "",
        })) ?? [],
      });
      setShowPlusOne(guest.plus_ones && guest.plus_ones.length > 0);
    }
  }, [guest, menus]);

  const handleChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : (value ?? ""),
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
        [name]: value ?? "",
      };
      return { ...prevData, plus_ones: newPlusOnes };
    });
  }, []);

  const handleTagChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: newValue ?? [],
    }));
  }, []);

  const handleAllergiesChange = useCallback((event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      allergies: newValue ?? [],
    }));
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
          allergies: [],
          disability: false,
          observations: "",
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
        needs_transport_back: formData.needs_transport_back,
        needs_hotel: formData.needs_hotel,
        disability: formData.disability,
        menu_id: formData.menu?.id ?? null,
        allergies: formData.allergies.map(allergy => allergy.id),
        observations: formData.observations,
        accommodation_plan: formData.accommodation_plan,
        tags: formData.tags.map(tag => tag.id),
        plus_ones: formData.plus_ones.map(plusOne => ({
          id: plusOne.id,
          first_name: plusOne.first_name,
          last_name: plusOne.last_name,
          menu_id: plusOne.menu?.id ?? null,
          allergies: plusOne.allergies.map(allergy => allergy.id),
          disability: plusOne.disability,
          observations: plusOne.observations,
        })),
      };

      if (guest && guest.id) {
        submitData.id = guest.id;
      }

      onSubmit(submitData);
    },
    [formData, guest, onSubmit]
  );

  const renderFormField = useCallback(
    (fieldName, component) => {
      return visibleFormFields[fieldName] ? component : null;
    },
    [visibleFormFields]
  );

  const renderTags = useMemo(
    () => (value, getTagProps) =>
      value.map((option, index) => {
        const { key, ...otherProps } = getTagProps({ index });
        return <TagChip key={key} tag={option} {...otherProps} />;
      }),
    []
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
              getOptionLabel={(option) => option?.name ?? ""}
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
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
            />
          </Grid>
        )}
        {renderFormField(
          "allergy",
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={allergies}
              getOptionLabel={(option) => option?.name ?? ""}
              value={formData.allergies}
              onChange={handleAllergiesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Alergias"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {renderFormField(
              "needs_transport",
              <Grid item xs={12} sm={3}>
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
              "needs_transport_back",
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.needs_transport_back}
                      onChange={handleChange}
                      name="needs_transport_back"
                    />
                  }
                  label="Necesita transporte de vuelta"
                />
              </Grid>
            )}
            {renderFormField(
              "needs_hotel",
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
              label="Desde donde sale"
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
          "tags",
          <Grid item xs={12}>
            <TagsInput
              tags={tags}
              formData={formData}
              handleTagChange={handleTagChange}
              onOpenTagModal={onOpenTagModal}
              renderTags={renderTags}
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

GuestForm.propTypes = {
  guest: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    needs_transport: PropTypes.bool,
    needs_transport_back: PropTypes.bool,
    needs_hotel: PropTypes.bool,
    disability: PropTypes.bool,
    menu_id: PropTypes.number,
    allergies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    observations: PropTypes.string,
    accommodation_plan: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    plus_ones: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        menu_id: PropTypes.number,
        allergies: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
          })
        ),
        disability: PropTypes.bool,
        observations: PropTypes.string,
      })
    ),
  }),
  onSubmit: PropTypes.func.isRequired,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  allergies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleFormFields: PropTypes.shape({
    first_name: PropTypes.bool,
    last_name: PropTypes.bool,
    phone: PropTypes.bool,
    email: PropTypes.bool,
    needs_transport: PropTypes.bool,
    needs_transport_back: PropTypes.bool,
    needs_hotel: PropTypes.bool,
    disability: PropTypes.bool,
    menu: PropTypes.bool,
    allergy: PropTypes.bool,
    observations: PropTypes.bool,
    accommodation_plan: PropTypes.bool,
    tags: PropTypes.bool,
    plus_ones: PropTypes.bool,
  }).isRequired,
  onOpenTagModal: PropTypes.func.isRequired,
};

export default GuestForm;