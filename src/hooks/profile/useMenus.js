import { useState, useEffect } from 'react';
import { menuService } from '../../services/Api';

const useMenus = (open) => {
  const [menus, setMenus] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: '' });

  useEffect(() => {
    if (open) {
      loadMenus();
    }
  }, [open]);

  const loadMenus = async () => {
    try {
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
    }
  };

  const handleExpandMenu = (id) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  const handleDeleteMenu = async (id) => {
    try {
      await menuService.deleteMenu(id);
      await loadMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const handleUpdateMenu = async () => {
    try {
      await menuService.updateMenu(editingMenu.id, editingMenu);
      setEditingMenu(null);
      await loadMenus();
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };

  const handleAddMenu = async () => {
    try {
      await menuService.createMenu(newMenu);
      setIsCreating(false);
      setNewMenu({ name: '' });
      await loadMenus();
    } catch (error) {
      console.error('Error adding menu:', error);
    }
  };

  const resetState = () => {
    setEditingMenu(null);
    setIsCreating(false);
    setNewMenu({ name: '' });
    setExpandedMenu(null);
  };

  return {
    menus,
    expandedMenu,
    editingMenu,
    isCreating,
    newMenu,
    handleExpandMenu,
    setEditingMenu,
    handleDeleteMenu,
    handleUpdateMenu,
    setIsCreating,
    setNewMenu,
    handleAddMenu,
    resetState,
  };
};

export default useMenus;