// React
import React from 'react';

// Biblioteca de terceros
import PropTypes from 'prop-types';

// Material-UI
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CloseButton = ({ onClose }) => {
  return (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: -10,
        top: -10,
        width: 40,
        height: 40,
        backgroundColor: 'white',
        boxShadow: 1,
        borderRadius: 2,
        zIndex: 1301,
        '&:hover': {
          backgroundColor: 'white',
        },
        '& .MuiSvgIcon-root': {
          color: (theme) => theme.palette.grey[700],
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

CloseButton.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CloseButton;