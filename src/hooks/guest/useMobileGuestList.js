// React hooks
import { useState, useCallback, useMemo } from 'react';

const GUESTS_PER_PAGE = 10;

const useMobileGuestList = (guests, onBulkActionComplete) => {
  const [page, setPage] = useState(1);
  const [expandedGuest, setExpandedGuest] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGuestForMenu, setSelectedGuestForMenu] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);

  const groupedGuests = useMemo(() => {
    return guests.map(guest => ({
      ...guest,
      companions: guest.companions || []
    }));
  }, [guests]);

  const paginatedGuests = useMemo(() => {
    const startIndex = (page - 1) * GUESTS_PER_PAGE;
    const endIndex = Math.min(startIndex + GUESTS_PER_PAGE, groupedGuests.length);
    return groupedGuests.slice(startIndex, endIndex);
  }, [groupedGuests, page]);

  const handleAccordionChange = useCallback((guestId) => (event, isExpanded) => {
    setExpandedGuest(isExpanded ? guestId : null);
  }, []);

  const handleSelectGuest = useCallback((guest) => {
    setSelectedGuests((prev) => {
      const isSelected = prev.some((g) => g.id === guest.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== guest.id && g.mainGuestId !== guest.id);
      } else {
        const newSelection = [...prev, guest];
        if (!guest.isCompanion && guest.companions) {
          newSelection.push(...guest.companions);
        }
        return newSelection;
      }
    });
  }, []);

  const handleBulkValidate = useCallback(() => {
    onBulkActionComplete('validate', selectedGuests.map(guest => guest.id));
    setSelectedGuests([]);
  }, [selectedGuests, onBulkActionComplete]);

  const handleMenuOpen = useCallback((event, guest) => {
    setAnchorEl(event.currentTarget);
    setSelectedGuestForMenu(guest);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedGuestForMenu(null);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    setExpandedGuest(null);
  }, []);

  const totalPages = Math.ceil(groupedGuests.length / GUESTS_PER_PAGE);

  return {
    page,
    expandedGuest,
    anchorEl,
    selectedGuestForMenu,
    selectedGuests,
    paginatedGuests,
    totalPages,
    handleAccordionChange,
    handleSelectGuest,
    handleBulkValidate,
    handleMenuOpen,
    handleMenuClose,
    handlePageChange,
    setSelectedGuests
  };
};

export default useMobileGuestList;