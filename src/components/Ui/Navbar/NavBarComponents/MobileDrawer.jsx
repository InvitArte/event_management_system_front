// React
import React from 'react';

// Biblioteca de terceros
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material-UI
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  ListItemButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MobileDrawer = ({ isOpen, onClose, menuItems }) => {
  // Separar la opción de "Desconectarse" del resto de los ítems
  const regularItems = menuItems.filter(item => item.label !== "Desconectarse");
  const logoutItem = menuItems.find(item => item.label === "Desconectarse");

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: { width: '250px' },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              <IconButton onClick={onClose} edge="start" color="inherit" aria-label="close">
                <CloseIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary="Menú" />
          </ListItem>
          <Divider />
          {regularItems.map((item, index) => (
            <ListItemButton
              key={index}
              component={item.to ? Link : 'button'}
              to={item.to}
              onClick={() => {
                if (item.onClick) item.onClick();
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible */}
        {logoutItem && (
          <>
            <Divider />
            <List>
              <ListItemButton
                onClick={() => {
                  if (logoutItem.onClick) logoutItem.onClick();
                  onClose();
                }}
              >
                <ListItemIcon>{logoutItem.icon}</ListItemIcon>
                <ListItemText primary={logoutItem.label} />
              </ListItemButton>
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
};

MobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      to: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
};

export default MobileDrawer;