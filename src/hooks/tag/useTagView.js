// React y hooks
import { useState, useEffect, useCallback, useMemo } from "react";

// Servicios y configuraciones
import { tagService, guestService } from "../../services/Api";
import { translateError } from "../../config";
// Componentes genéricos
import { normalizeText } from "../../components";

const useTagView = (initialVisibleColumns) => {
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);
  const [filters, setFilters] = useState({});
  const [uiState, setUiState] = useState({
    loading: true,
    error: "",
    modalOpen: false,
    selectedTag: null,
    deleteDialogOpen: false,
    tagToDelete: null,
    visibleColumns: initialVisibleColumns,
    sortModel: [],
  });

  const capitalizeFirstLetter = (string) => {
    return string.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const fetchData = useCallback(async () => {
    try {
      const [tagsResponse, guestsResponse] = await Promise.all([
        tagService.getAllTags(),
        guestService.getAllGuests(),
      ]);
      setTags(tagsResponse);

      const normalizedGuests = guestsResponse.map(guest => ({
        ...guest,
        first_name: capitalizeFirstLetter(guest.first_name),
        last_name: capitalizeFirstLetter(guest.last_name),
        fullName: `${capitalizeFirstLetter(guest.first_name)} ${capitalizeFirstLetter(guest.last_name)}`.trim()
      }));
      setGuests(normalizedGuests);
      setUiState(prev => ({ ...prev, loading: false, error: "" }));
    } catch (err) {
      console.error("Error fetching data:", err);
      setUiState(prev => ({ ...prev, loading: false, error: translateError(err) }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTag = useCallback(() => {
    setUiState(prev => ({ ...prev, selectedTag: null, modalOpen: true }));
  }, []);

  const handleEditTag = useCallback((tag) => {
    setUiState(prev => ({ ...prev, selectedTag: tag, modalOpen: true }));
  }, []);

  const handleDeleteTag = useCallback((tag) => {
    setUiState(prev => ({
      ...prev,
      tagToDelete: tag,
      deleteDialogOpen: true,
    }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (uiState.tagToDelete) {
      try {
        await tagService.deleteTag(uiState.tagToDelete.id);
        setTags(prevTags => prevTags.filter(tag => tag.id !== uiState.tagToDelete.id));
        setUiState(prev => ({
          ...prev,
          deleteDialogOpen: false,
          tagToDelete: null,
          error: "",
        }));
      } catch (err) {
        console.error("Error deleting tag:", err);
        setUiState(prev => ({
          ...prev,
          error: translateError(err),
          deleteDialogOpen: false,
          tagToDelete: null,
        }));
      }
    }
  }, [uiState.tagToDelete]);

  const handleTagUpdate = useCallback((updatedTag, updatedGuests) => {
    setTags((prevTags) => {
      const index = prevTags.findIndex((tag) => tag.id === updatedTag.id);
      if (index !== -1) {
        return [
          ...prevTags.slice(0, index),
          updatedTag,
          ...prevTags.slice(index + 1),
        ];
      }
      return [...prevTags, updatedTag];
    });

    setGuests((prevGuests) => {
      return prevGuests.map((guest) => {
        const updatedGuest = updatedGuests.find((g) => g.id === guest.id);
        if (updatedGuest) {
          return {
            ...guest,
            tags: updatedGuest.tags,
          };
        }
        return guest;
      });
    });

    setUiState(prev => ({ ...prev, modalOpen: false, selectedTag: null, error: "" }));
  }, []);

  const handleCloseModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      modalOpen: false,
      selectedTag: null,
      error: "",
    }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      if (filters.tag_name && !normalizeText(tag.name).includes(normalizeText(filters.tag_name))) {
        return false;
      }

      if (filters.guest_name) {
        const tagGuests = guests.filter(guest =>
          guest.tags.some(t => t.id === tag.id)
        );
        return tagGuests.some(guest =>
          normalizeText(guest.fullName).includes(normalizeText(filters.guest_name))
        );
      }

      return true;
    });
  }, [tags, guests, filters]);

  const columns = [
    { field: "name", headerName: "Nombre" },
    { field: "guests", headerName: "Invitados" },
  ];

  const excelData = useMemo(() => {
    let sortedTags = [...filteredTags];
    if (uiState.sortModel.length > 0) {
      const { field, sort } = uiState.sortModel[0];
      sortedTags.sort((a, b) => {
        if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
        if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedTags.map(tag => {
      const tagGuests = guests.filter(guest =>
        guest.tags.some(t => t.id === tag.id)
      );

      const guestList = tagGuests.map(guest => {
        let guestString = guest.fullName;
        if (guest.plus_ones && guest.plus_ones.length > 0) {
          const plusOnesString = guest.plus_ones
            .map(plusOne => `${plusOne.first_name} ${plusOne.last_name}`)
            .join(', ');
          guestString += ` (+ ${plusOnesString})`;
        }
        return guestString;
      }).join(', ');

      return {
        Nombre: tag.name,
        Invitados: guestList
      };
    });
  }, [filteredTags, guests, uiState.sortModel]);

  const excelColumnWidths = useMemo(() => {
    const maxGuestListLength = Math.max(...excelData.map(row => row.Invitados.length));
    const averageCharWidth = 6; // Reducido de 7 a 6 píxeles
    const padding = 10; // Reducido de 20 a 10 píxeles
    const baseWidth = 50; // Ancho base para la columna

    // Función para calcular el ancho logarítmico
    const logWidth = (length) => {
      return Math.round(baseWidth + (Math.log(length) / Math.log(2)) * 10);
    };

    const calculatedWidth = logWidth(maxGuestListLength);

    return {
      Nombre: 30,
      Invitados: Math.min(Math.max(calculatedWidth, baseWidth), 150) // Máximo reducido a 150
    };
  }, [excelData]);

  const handleVisibleColumnsChange = useCallback((newVisibleColumns) => {
    setUiState(prev => ({ ...prev, visibleColumns: newVisibleColumns }));
  }, []);

  const setError = useCallback((error) => {
    setUiState(prev => ({ ...prev, error }));
  }, []);

  return {
    tags,
    guests,
    filteredTags,
    uiState,
    handleCreateTag,
    handleEditTag,
    handleDeleteTag,
    handleConfirmDelete,
    handleTagUpdate,
    handleCloseModal,
    handleFilterChange,
    setUiState,
    setError,
    excelData,
    excelColumnWidths,
    handleVisibleColumnsChange,
  };
};

export default useTagView;