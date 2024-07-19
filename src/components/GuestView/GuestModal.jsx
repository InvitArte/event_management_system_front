import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  CircularProgress,
  Typography
} from '@mui/material';
import { guestService } from '../../services/api';
import GuestForm from './GuestForm';

const GuestModal = ({ open, onClose, guest, onSubmit, menus, allergies }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const guestData = {
        guest: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          email: formData.email,
          needs_transport: formData.needs_transport,
          needs_hotel: formData.needs_hotel,
          disability: formData.disability,
          menu_id: formData.menu_id,
          allergy_id: formData.allergy_id,
          observations: formData.observations,
          accommodation_plan: formData.accommodation_plan,
        },
        plus_ones: formData.plus_ones.map(plusOne => ({
          first_name: plusOne.first_name,
          last_name: plusOne.last_name,
          menu_id: plusOne.menu_id,
          allergy_id: plusOne.allergy_id,
          disability: plusOne.disability
        }))
      };

      console.log('Submitting guest data:', guestData);
      let response;
      if (guest) {
        response = await guestService.updateGuest(guest.id, guestData);
      } else {
        response = await guestService.createGuest(guestData);
      }
      console.log('Guest saved successfully:', response);
      onSubmit();
      onClose();
    } catch (err) {
      console.error('Error submitting guest:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        
        if (err.response.data && err.response.data.errors) {
          const errorMessages = Object.entries(err.response.data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          setError(`Failed to save guest: ${errorMessages}`);
        } else if (err.response.data && err.response.data.message) {
          setError(`Failed to save guest: ${err.response.data.message}`);
        } else {
          setError(`Failed to save guest. Server responded with status ${err.response.status}`);
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Failed to save guest. No response received from server.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Failed to save guest: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{guest ? 'Editar Invitado' : 'Crear Nuevo Invitado'}</DialogTitle>
      <DialogContent>
        <GuestForm
          guest={guest}
          onSubmit={handleSubmit}
          menus={menus}
          allergies={allergies}
        />
        {error && (
          <Typography color="error" align="center" style={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button 
          onClick={() => document.getElementById('guest-form-submit').click()} 
          color="primary" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuestModal;