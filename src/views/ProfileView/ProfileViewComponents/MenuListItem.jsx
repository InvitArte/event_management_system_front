import React from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const MenuListItem = ({
  menu,
  setEditingMenu,
  handleDeleteMenu,
}) => (
  <ListItem disableGutters>
    <ListItemText primary={menu.name} />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="edit"
        onClick={() => setEditingMenu(menu)}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => handleDeleteMenu(menu.id)}
        size="small"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

MenuListItem.propTypes = {
  menu: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setEditingMenu: PropTypes.func.isRequired,
  handleDeleteMenu: PropTypes.func.isRequired,
};

export default MenuListItem;