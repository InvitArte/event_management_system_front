import React from "react";
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

export default PlusOneForm;
