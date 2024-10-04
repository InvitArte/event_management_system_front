// React
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { List, ListItem, ListItemText } from "@mui/material";

// Componentes propios
import MenuListItem from "./MenuListItem";

const MenuList = ({
  menus,
  expandedMenu,
  handleExpandMenu,
  setEditingMenu,
  handleDeleteMenu,
}) => (
  <List>
    {menus.length > 0 ? (
      menus.map((menu) => (
        <MenuListItem
          key={menu.id}
          menu={menu}
          expanded={expandedMenu === menu.id}
          handleExpandMenu={handleExpandMenu}
          setEditingMenu={setEditingMenu}
          handleDeleteMenu={handleDeleteMenu}
        />
      ))
    ) : (
      <ListItem>
        <ListItemText primary="No hay menús disponibles" />
      </ListItem>
    )}
  </List>
);

MenuList.propTypes = {
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  expandedMenu: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleExpandMenu: PropTypes.func.isRequired,
  setEditingMenu: PropTypes.func.isRequired,
  handleDeleteMenu: PropTypes.func.isRequired,
};

export default MenuList;