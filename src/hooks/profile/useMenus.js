import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../../services/Api';

const useMenus = (open) => {
  const [menus, setMenus] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [editingMenu, setEditingMenu] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);

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

  const handleDeleteMenu = useCallback((menu) => {
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (menuToDelete) {
      try {
        await menuService.deleteMenu(menuToDelete.id);
        await loadMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      } finally {
        setDeleteDialogOpen(false);
        setMenuToDelete(null);
      }
    }
  }, [menuToDelete, loadMenus]);

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

  const resetState = useCallback(() => {
    setEditingMenu(null);
    setIsCreating(false);
    setNewMenu({ name: '' });
    setExpandedMenu(null);
    setDeleteDialogOpen(false);
    setMenuToDelete(null);
  }, []);

  return {
    menus,
    expandedMenu,
    editingMenu,
    isCreating,
    newMenu,
    handleExpandMenu,
    setEditingMenu,
    handleUpdateMenu,
    setIsCreating,
    setNewMenu,
    handleAddMenu,
    resetState,
    deleteDialogOpen,
    menuToDelete,
    handleDeleteMenu,
    handleConfirmDelete,
    setDeleteDialogOpen,
  };
};

export default useMenus;