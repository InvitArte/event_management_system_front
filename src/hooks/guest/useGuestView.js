import { useState, useEffect, useMemo, useCallback } from "react";
import { guestService, tagService, menuService, allergyService } from "../../services/Api";
import { normalizeText } from "../../components";

const useGuestView = (initialVisibleColumns) => {
  const [guestData, setGuestData] = useState({
    guests: [],
    originalGuests: [],
    menus: [],
    allergies: [],
    allAllergies: [],
    tags: [],
    allTags: [],
  });

  const [uiState, setUiState] = useState({
    loading: true,
    error: "",
    filters: {},
    modalOpen: false,
    selectedGuest: null,
    visibleColumns: initialVisibleColumns,
    sortModel: [],
    deleteDialogOpen: false,
    guestToDelete: null,
    selectedTagId: null,
  });

  const [selectedGuests, setSelectedGuests] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [guestsResponse, tagsResponse, menusResponse, allergiesResponse] = await Promise.all([
        guestService.getAllGuests(),
        tagService.getAllTags(),
        menuService.getUserMenus(),
        allergyService.getAllAllergies(),
      ]);
      return {
        guests: guestsResponse,
        tags: tagsResponse,
        menus: menusResponse,
        allergies: allergiesResponse
      };
    } catch (error) {
      console.error("Error al recibir la información:", error);
      throw error;
    }
  }, []);

  const processGuests = useCallback((guestsData, userMenus, allergies) => {
    if (!Array.isArray(guestsData)) {
      console.error("guestData no es un array:", guestsData);
      return { guests: [], menus: userMenus, allergies: allergies, tags: [] };
    }

    const uniqueTags = new Set();
    const uniqueAllergies = new Map();

    const capitalizeFirstLetter = (string) => {
      return string.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    const processedGuests = guestsData.flatMap((guest) => {
      guest.tags?.forEach((tag) => {
        uniqueTags.add(JSON.stringify(tag));
      });

      const guestMenu = userMenus.find(m => m.id === guest.menu_id);
      const guestAllergies = guest.allergies || [];
      guestAllergies.forEach(allergy => {
        uniqueAllergies.set(allergy.id, allergy);
      });

      const mainGuest = {
        id: guest.id,
        first_name: capitalizeFirstLetter(guest.first_name),
        last_name: capitalizeFirstLetter(guest.last_name),
        fullName: `${capitalizeFirstLetter(guest.first_name)} ${capitalizeFirstLetter(guest.last_name)}`.trim(),
        email: guest.email || "",
        phone: guest.phone || "",
        validated: Boolean(guest.validated),
        menu: guestMenu ? guestMenu.name : "No ha especificado",
        menu_id: guestMenu ? guestMenu.id : null,
        allergies: guestAllergies,
        needs_hotel: Boolean(guest.needs_hotel),
        needs_transport: Boolean(guest.needs_transport),
        needs_transport_back: Boolean(guest.needs_transport_back),
        disability: Boolean(guest.disability),
        observations: guest.observations || "",
        accommodation_plan: guest.accommodation_plan || "No ha especificado",
        isMainGuest: true,
        tags: guest.tags || [],
      };

      const plusOnes = guest.plus_ones?.map((plusOne) => {
        const plusOneMenu = userMenus.find(m => m.id === plusOne.menu_id);
        const plusOneAllergies = plusOne.allergies || [];
        plusOneAllergies.forEach(allergy => {
          uniqueAllergies.set(allergy.id, allergy);
        });

        return {
          id: plusOne.id,
          first_name: capitalizeFirstLetter(plusOne.first_name),
          last_name: capitalizeFirstLetter(plusOne.last_name),
          fullName: `${capitalizeFirstLetter(plusOne.first_name)} ${capitalizeFirstLetter(plusOne.last_name)}`.trim(),
          email: plusOne.email || "",
          phone: plusOne.phone || "",
          validated: Boolean(guest.validated),
          menu: plusOneMenu ? plusOneMenu.name : "No ha especificado",
          menu_id: plusOneMenu ? plusOneMenu.id : null,
          allergies: plusOneAllergies,
          needs_hotel: Boolean(guest.needs_hotel),
          needs_transport: Boolean(guest.needs_transport),
          needs_transport_back: Boolean(guest.needs_transport_back),
          disability: Boolean(plusOne.disability),
          observations: plusOne.observations || "",
          accommodation_plan: guest.accommodation_plan || "No ha especificado",
          isMainGuest: false,
          parentId: guest.id,
          tags: [],
        };
      }) || [];

      return [mainGuest, ...plusOnes];
    });

    return {
      guests: processedGuests,
      menus: userMenus,
      allergies: Array.from(uniqueAllergies.values()),
      tags: Array.from(uniqueTags).map((tag) => JSON.parse(tag)),
    };
  }, []);

  const processData = useCallback(
    (data) => {
      const processedGuests = processGuests(data.guests, data.menus, data.allergies);
      return {
        ...processedGuests,
        originalGuests: data.guests,
        allTags: data.tags,
        allAllergies: data.allergies,
      };
    },
    [processGuests]
  );

  const fetchGuests = useCallback(async () => {
    try {
      const data = await fetchData();
      const processedData = processData(data);
      setGuestData(processedData);
      setUiState((prev) => ({ ...prev, loading: false, error: "" }));
    } catch (error) {
      setUiState((prev) => ({
        ...prev,
        loading: false,
        error: "Error al recibir la información. Por favor intento de nuevo.",
      }));
    }
  }, [fetchData, processData]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const filteredGuests = useMemo(() => {
    if (Object.keys(uiState.filters).length === 0) {
      return guestData.guests;
    }

    const filterGuest = (guest) => {
      return Object.entries(uiState.filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;

        switch (key) {
          case "menu":
            return guest.menu?.toLowerCase() === value.toLowerCase();
          case "allergies":
            if (Array.isArray(value) && value.length > 0) {
              return value.some(filterAllergy =>
                guest.allergies.some(guestAllergy =>
                  guestAllergy.id === filterAllergy.id
                )
              );
            }
            return true;
          case "needs_hotel":
          case "needs_transport":
          case "needs_transport_back":
          case "validated":
            return guest[key] === (value === "Sí");
          case "tags":
            return value.every((filterTag) =>
              guest.tags?.some(
                (guestTag) => guestTag.name.toLowerCase() === filterTag.name.toLowerCase()
              )
            );
          case "accommodation_plan":
            return guest[key]?.toLowerCase() === value.toLowerCase();
          case "full_name":
            return normalizeText(guest.fullName).includes(normalizeText(value));
          default:
            return guest[key]?.toString().toLowerCase().includes(value.toLowerCase());
        }
      });
    };

    const isMenuOrAllergyFilter = Object.keys(uiState.filters).some(key =>
      key === "menu" || key === "allergies"
    );

    if (isMenuOrAllergyFilter) {
      // Si hay filtros de menú o alergias, aplicamos el filtro directamente
      return guestData.guests.filter(filterGuest);
    } else {
      // Para otros filtros, mantenemos la lógica de incluir invitados principales y plus ones relacionados
      const filteredMainGuests = guestData.guests.filter((guest) => guest.isMainGuest && filterGuest(guest));
      const filteredPlusOnes = guestData.guests.filter((guest) => !guest.isMainGuest && filterGuest(guest));

      const mainGuestIds = new Set(filteredMainGuests.map(guest => guest.id));
      const plusOneParentIds = new Set(filteredPlusOnes.map(guest => guest.parentId));

      return guestData.guests.filter((guest) => {
        if (guest.isMainGuest) {
          return mainGuestIds.has(guest.id) || plusOneParentIds.has(guest.id);
        } else {
          return filteredPlusOnes.includes(guest) || mainGuestIds.has(guest.parentId);
        }
      });
    }
  }, [guestData.guests, uiState.filters]);

  const mobileGuestList = useMemo(() => {
    return filteredGuests.reduce((acc, guest) => {
      if (guest.isMainGuest) {
        const companions = filteredGuests.filter(g => !g.isMainGuest && g.parentId === guest.id);
        acc.push({...guest, companions});
      }
      return acc;
    }, []);
  }, [filteredGuests]);

  const handleFilterChange = useCallback((newFilters) => {
    setUiState((prev) => ({
      ...prev,
      filters: Object.keys(newFilters).length === 0 ? {} : {
        ...prev.filters,
        ...newFilters
      }
    }));
  }, []);

  const handleCreateGuest = useCallback(() => {
    setUiState((prev) => ({ ...prev, selectedGuest: null, modalOpen: true }));
  }, []);

  const handleEditGuest = useCallback((guest) => {
    const fullGuest = guestData.originalGuests.find(g => g.id === guest.id);
    setUiState((prev) => ({ ...prev, selectedGuest: fullGuest, modalOpen: true }));
  }, [guestData.originalGuests]);

  const handleDeleteGuest = useCallback((guest) => {
    setUiState((prev) => ({
      ...prev,
      guestToDelete: guest,
      deleteDialogOpen: true,
    }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (uiState.guestToDelete) {
      try {
        await guestService.deleteGuest(uiState.guestToDelete.id);
        await fetchGuests();
      } catch (error) {
        console.error("Error al eliminar al invitado:", error);
      } finally {
        setUiState((prev) => ({
          ...prev,
          deleteDialogOpen: false,
          guestToDelete: null,
        }));
      }
    }
  }, [uiState.guestToDelete, fetchGuests]);

  const handleBulkActionComplete = useCallback(
    async (action, guestIds) => {
      try {
        if (action === "validate") {
          await guestService.bulkValidate(guestIds);
        } else if (action === "assignTag") {
          const tagId = uiState.selectedTagId;
          if (tagId) {
            await tagService.bulkAssign(tagId, guestIds);
          } else {
            console.error("No tag selected for bulk assign");
          }
        }
        await fetchGuests();
      } catch (error) {
        console.error("Error performing bulk action:", error);
        setUiState((prev) => ({
          ...prev,
          error: "Error al hacer la acción en masa. Por favor intentelo de nuevo.",
        }));
      }
    },
    [fetchGuests, uiState.selectedTagId]
  );

  const handleGuestSubmitted = useCallback(async (updatedGuest) => {
    try {
      // Actualización optimista
      setGuestData((prevData) => ({
        ...prevData,
        guests: prevData.guests.map((g) =>
          g.id === updatedGuest.id ? { ...g, ...updatedGuest } : g
        ),
        originalGuests: prevData.originalGuests.map((g) =>
          g.id === updatedGuest.id ? { ...g, ...updatedGuest } : g
        ),
      }));

      setUiState((prev) => ({ ...prev, modalOpen: false }));

      // Actualizar los datos en segundo plano
      await fetchGuests();
    } catch (error) {
      console.error("Error updating guest list:", error);
      setUiState((prev) => ({
        ...prev,
        error: "Fallo al actualizar la lista de invitados. Por favor recargue la página.",
      }));
    }
  }, [fetchGuests]);

  const handleVisibleColumnsChange = useCallback((newVisibleColumns) => {
    setUiState((prev) => ({ ...prev, visibleColumns: newVisibleColumns }));
  }, []);

  const updateTags = useCallback((updatedTag) => {
    setGuestData((prevData) => {
      const updatedAllTags = prevData.allTags.map(tag =>
        tag.id === updatedTag.id ? updatedTag : tag
      );
      if (!updatedAllTags.find(tag => tag.id === updatedTag.id)) {
        updatedAllTags.push(updatedTag);
      }
      return {
        ...prevData,
        allTags: updatedAllTags,
        tags: updatedAllTags, // Assuming tags and allTags are the same in this context
      };
    });
  }, []);

  return {
    guestData,
    uiState,
    selectedGuests,
    setSelectedGuests,
    filteredGuests,
    mobileGuestList,
    handleFilterChange,
    handleCreateGuest,
    handleEditGuest,
    handleDeleteGuest,
    handleConfirmDelete,
    handleBulkActionComplete,
    handleGuestSubmitted,
    handleVisibleColumnsChange,
    setUiState,
    updateTags,
  };
};

export default useGuestView;