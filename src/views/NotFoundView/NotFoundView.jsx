// React y hooks
import React from 'react';

// Bibliotecas de terceros
import { Link as RouterLink } from 'react-router-dom';

// Material-UI
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundView = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: (theme) => theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Oops! Página no encontrada.
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Volver a la página principal
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundView;