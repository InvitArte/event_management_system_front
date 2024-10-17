// React
import React from 'react';

// Bibliotecas de terceros
import PropTypes from 'prop-types';

// Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';

// Componentes genéricos
import { CloseButton } from '../../../components';

const ReusableModal = ({
    open,
    onClose,
    title,
    children,
    onSubmit,
    loading,
    error,
    submitButtonText = 'Guardar',
    cancelButtonText = 'Cancelar',
    maxWidth = 'md',
    hideSubmitButton = false,
    fullWidth = true,
  }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        PaperProps={{
          sx: {
            overflow: 'visible',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative', paddingRight: '40px' }}>
          {title}
          <CloseButton onClose={onClose} />
        </DialogTitle>
        <DialogContent>
          {children}
          {error && (
            <Typography
              color="error"
              align="center"
              style={{ marginTop: '1rem' }}
            >
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            {cancelButtonText}
          </Button>
          {!hideSubmitButton && (
            <Button
              onClick={onSubmit}
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : submitButtonText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  ReusableModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    submitButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    maxWidth: PropTypes.string,
    hideSubmitButton: PropTypes.bool,
    fullWidth: PropTypes.bool,
  };

  export default ReusableModal;