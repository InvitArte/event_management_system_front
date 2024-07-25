import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginView/LoginForm';
import { authService } from '../services/api';

const LoginView = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/guests');
      } else {
        setError('Login correcto pero no hubo login.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Un error ocurrió durante el login.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      justifyContent: 'center',
      alignItems: 'center', 
    }}>
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Acceder
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginView;
