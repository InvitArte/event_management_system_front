import React from "react";
import PropTypes from "prop-types";
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
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Grid>
    )}
    {visibleFormFields.plus_one_allergy && (
      <Grid item xs={12} sm={4}>
        <Autocomplete
          multiple
          options={allergies}
          getOptionLabel={(option) => option.name}
          value={plusOne.allergies || []}
          onChange={(event, newValue) =>
            handlePlusOneChange(index, "allergies", newValue)
          }
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
          isOptionEqualToValue={(option, value) => option.id === value.id}
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

PlusOneForm.propTypes = {
  plusOne: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    menu: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    allergies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    disability: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number.isRequired,
  handlePlusOneChange: PropTypes.func.isRequired,
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
  visibleFormFields: PropTypes.shape({
    plus_one_first_name: PropTypes.bool,
    plus_one_last_name: PropTypes.bool,
    plus_one_menu: PropTypes.bool,
    plus_one_allergy: PropTypes.bool,
    plus_one_disability: PropTypes.bool,
  }).isRequired,
  removePlusOne: PropTypes.func.isRequired,
};

export default PlusOneForm;