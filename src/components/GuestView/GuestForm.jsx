import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Grid, Typography, Autocomplete } from '@mui/material';

const GuestForm = ({ guest, onSubmit, menus, allergies }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    needs_transport: false,
    needs_hotel: false,
    disability: false,
    menu: null,
    allergy: null,
    observations: '',
    accommodation_plan: '',
    plus_ones: []
  });
  const [showPlusOne, setShowPlusOne] = useState(false);

  useEffect(() => {
    if (guest) {
      setFormData({
        ...guest,
        menu: menus.find(m => m.id === guest.menu_id) || null,
        allergy: allergies.find(a => a.id === guest.allergy_id) || null,
        plus_ones: guest.plus_ones.map(po => ({
          ...po,
          menu: menus.find(m => m.id === po.menu_id) || null,
          allergy: allergies.find(a => a.id === po.allergy_id) || null,
        }))
      });
      setShowPlusOne(guest.plus_ones && guest.plus_ones.length > 0);
    }
  }, [guest, menus, allergies]);

  useEffect(() => {
    console.log('Menus prop:', menus);
    console.log('Allergies prop:', allergies);
  }, [menus, allergies]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePlusOneChange = (index, name, value) => {
    setFormData(prevData => {
      const newPlusOnes = [...prevData.plus_ones];
      newPlusOnes[index] = {
        ...newPlusOnes[index],
        [name]: value
      };
      return { ...prevData, plus_ones: newPlusOnes };
    });
  };

  const addPlusOne = () => {
    setFormData(prevData => ({
      ...prevData,
      plus_ones: [...prevData.plus_ones, { first_name: '', last_name: '', menu: null, allergy: null, disability: false }]
    }));
    setShowPlusOne(true);
  };

  const removePlusOne = (index) => {
    setFormData(prevData => ({
      ...prevData,
      plus_ones: prevData.plus_ones.filter((_, i) => i !== index)
    }));
    if (formData.plus_ones.length === 1) {
      setShowPlusOne(false);
    }
  };

  const handleSubmit = (e) => {
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
      observations: formData.observations || '',
      accommodation_plan: formData.accommodation_plan || '',
      plus_ones: formData.plus_ones.map(plusOne => ({
        first_name: plusOne.first_name,
        last_name: plusOne.last_name,
        menu_id: plusOne.menu?.id || null,
        allergy_id: plusOne.allergy?.id || null,
        disability: plusOne.disability
      }))
    };

  
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={menus}
            getOptionLabel={(option) => option.name}
            value={formData.menu}
            onChange={(event, newValue) => {
              handleAutocompleteChange('menu', newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Menú" variant="outlined" margin="normal" InputLabelProps={{shrink: true}} />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={allergies}
            getOptionLabel={(option) => option.name}
            value={formData.allergy}
            onChange={(event, newValue) => {
              handleAutocompleteChange('allergy', newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Alergia" variant="outlined" margin="normal" InputLabelProps={{shrink: true}} />}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
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
          </Grid>
        </Grid>
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
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Plan de alojamiento"
            name="accommodation_plan"
            value={formData.accommodation_plan}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={addPlusOne} variant="outlined" color="primary">
            Añadir Acompañante
          </Button>
        </Grid>
        {showPlusOne && formData.plus_ones.map((plusOne, index) => (
          <Grid container item xs={12} key={index} spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Acompañante {index + 1}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nombre"
                name="first_name"
                value={plusOne.first_name}
                onChange={(e) => handlePlusOneChange(index, 'first_name', e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Apellido"
                name="last_name"
                value={plusOne.last_name}
                onChange={(e) => handlePlusOneChange(index, 'last_name', e.target.value)}
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={menus}
                getOptionLabel={(option) => option.name}
                value={plusOne.menu}
                onChange={(event, newValue) => {
                  handlePlusOneChange(index, 'menu', newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Menú" variant="outlined" margin="normal" InputLabelProps={{shrink: true}} />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={allergies}
                getOptionLabel={(option) => option.name}
                value={plusOne.allergy}
                onChange={(event, newValue) => {
                  handlePlusOneChange(index, 'allergy', newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Alergia" variant="outlined" margin="normal" InputLabelProps={{shrink: true}} />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={plusOne.disability}
                    onChange={(e) => handlePlusOneChange(index, 'disability', e.target.checked)}
                    name="disability"
                  />
                }
                label="Tiene discapacidad"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button onClick={() => removePlusOne(index)} color="secondary" variant="outlined" fullWidth>
                Eliminar Acompañante
              </Button>
            </Grid>
          </Grid>
        ))}
        <button type="submit" id="guest-form-submit" style={{ display: 'none' }} />
      </Grid>
    </form>
  );
};

export default GuestForm;