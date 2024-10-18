// React y hooks
import { useState, useCallback } from 'react';

const useMobileTagList = () => {
  const [expandedTag, setExpandedTag] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTagForMenu, setSelectedTagForMenu] = useState(null);

  const handleAccordionChange = useCallback((tagId) => (event, isExpanded) => {
    setExpandedTag(isExpanded ? tagId : null);
  }, []);

  const handleMenuOpen = useCallback((event, tag) => {
    setAnchorEl(event.currentTarget);
    setSelectedTagForMenu(tag);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedTagForMenu(null);
  }, []);

  return {
    expandedTag,
    anchorEl,
    selectedTagForMenu,
    handleAccordionChange,
    handleMenuOpen,
    handleMenuClose,
  };
};

export default useMobileTagList;