import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import { guestService, tagService, menuService, allergyService } from "../services/Api";
import GuestTable from "../components/GuestView/GuestTable";
import GuestFilters from "../components/GuestView/GuestFilters";
import ExcelDownloader from "../components/GuestView/ExcelDownloader";
import GuestModal from "../components/GuestView/GuestModal";
import SkeletonTable from "../components/Ui/SkeletonTable";
import DeleteConfirmationDialog from "../components/Ui/DeleteConfirmationDialog";
import { normalizeText } from "../components/Utils/TextUtils";

const GuestView = ({
  visibleColumns: initialVisibleColumns,
  visibleFilters,
  visibleFormFields,
}) => {
  const [guestData, setGuestData] = useState({
    guests: [],
    menus: [],
    allergies: [],
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = useCallback(async () => {
    try {
      const [guestsResponse, tagsResponse, menusResponse, allergiesResponse] = await Promise.all([
        guestService.getAllGuests(),
        tagService.getAllTags(),
        menuService.getUserMenus(),
        allergyService.getAllAllergies(),
      ]);
      console.log("Guests Response:", guestsResponse);

      return { 
        guests: guestsResponse, 
        tags: tagsResponse, 
        menus: menusResponse, 
        allergies: allergiesResponse 
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }, []);
 
  const processGuests = useCallback((guestsData, userMenus, allergies) => {
    if (!Array.isArray(guestsData)) {
      console.error("guestsData is not an array:", guestsData);
      return { guests: [], menus: userMenus, allergies: allergies, tags: [] };
    }
  
    const uniqueTags = new Set();
    const uniqueAllergies = new Map();
  
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
        fullName: `${guest.first_name} ${guest.last_name}`.trim(),
        first_name: guest.first_name,
        last_name: guest.last_name,
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
        plus_ones: guest.plus_ones || [],
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
          fullName: `${plusOne.first_name} ${plusOne.last_name}`.trim(),
          first_name: plusOne.first_name,
          last_name: plusOne.last_name,
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
        allTags: data.tags,
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
        error: "Failed to fetch data. Please try again later.",
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
    
    return guestData.guests.filter((guest) => {
      return Object.entries(uiState.filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;

        switch (key) {
          case "needs_hotel":
          case "needs_transport":
          case "needs_transport_back":
          case "validated":
            return guest[key] === (value === "Sí");
          case "allergies":
            if (Array.isArray(value) && value.length > 0) {
              return value.every(filterAllergy =>
                guest.allergies.some(guestAllergy => 
                  guestAllergy.id === filterAllergy.id
                )
              );
            }
            return true;
          case "tags":
            return value.every((tag) =>
              guest.tags?.some(
                (guestTag) => guestTag.name.toLowerCase() === tag.toLowerCase()
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
    });
  }, [guestData.guests, uiState.filters]);

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
    setUiState((prev) => ({ ...prev, selectedGuest: guest, modalOpen: true }));
  }, []);

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
        console.error("Error deleting guest:", error);
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
          error: "Failed to perform bulk action. Please try again.",
        }));
      }
    },
    [fetchGuests, uiState.selectedTagId]
  );

  const handleGuestSubmitted = useCallback(async () => {
    try {
      await fetchGuests();
      setUiState((prev) => ({ ...prev, modalOpen: false }));
    } catch (error) {
      console.error("Error updating guest list:", error);
      setUiState((prev) => ({
        ...prev,
        error: "Failed to update guest list. Please refresh the page.",
      }));
    }
  }, [fetchGuests]);

  const handleVisibleColumnsChange = useCallback((newVisibleColumns) => {
    setUiState((prev) => ({ ...prev, visibleColumns: newVisibleColumns }));
  }, []);

  const columns = [
    { field: "validated", headerName: "Validado" },
    { field: "fullName", headerName: "Nombre Completo" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Teléfono" },
    { field: "menu", headerName: "Menú" },
    { field: "allergy", headerName: "Alergias" },
    { field: "needs_hotel", headerName: "Necesita Hotel" },
    { field: "needs_transport", headerName: "Necesita Transporte" },
    { field: "needs_transport_back", headerName: "Necesita Transporte de Vuelta" },
    { field: "disability", headerName: "Discapacidad" },
    { field: "observations", headerName: "Observaciones" },
    { field: "accommodation_plan", headerName: "Plan de Alojamiento" },
    { field: "isMainGuest", headerName: "Tipo" },
    { field: "tags", headerName: "Etiquetas" },
  ];

  const excelData = useMemo(() => {
    let sortedGuests = [...filteredGuests];
    console.log("Sorted Guests:", sortedGuests);
    if (uiState.sortModel.length > 0) {
      const { field, sort } = uiState.sortModel[0];
      sortedGuests.sort((a, b) => {
        if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
        if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
        return 0;
      });
    }
  
    const processedData = sortedGuests.map((guest) => {
      const rowData = {
        ID: guest.id,
        "Nombre Completo": guest.fullName,
        Email: guest.email,
        Teléfono: guest.phone,
        Validado: guest.validated ? "Sí" : "No",
        Menú: guest.menu,
        Alergias: guest.allergies && Array.isArray(guest.allergies) 
          ? guest.allergies.map(allergy => allergy.name).join(", ")
          : "",
        "Necesita Hotel": guest.needs_hotel ? "Sí" : "No",
        "Necesita Transporte": guest.needs_transport ? "Sí" : "No",
        "Necesita Transporte de Vuelta": guest.needs_transport_back ? "Sí" : "No",
        Discapacidad: guest.disability ? "Sí" : "No",
        Observaciones: guest.observations,
        "Plan de Alojamiento": guest.accommodation_plan,
        Tipo: guest.isMainGuest ? "Invitado Principal" : "Acompañante",
        Etiquetas: guest.tags && Array.isArray(guest.tags)
          ? guest.tags.map((tag) => tag.name).join(", ")
          : "",
      };
  
      return Object.keys(rowData).reduce((acc, key) => {
        const columnField = columns.find(
          (col) => col.headerName === key || (key === "Alergias" && col.field === "allergy")
        )?.field;
        if (columnField && uiState.visibleColumns[columnField]) {
          acc[key] = rowData[key];
        }
        return acc;
      }, {});
    });
  
    console.log("Processed Excel Data:", processedData);
    return processedData;
  }, [filteredGuests, uiState.visibleColumns, uiState.sortModel, columns]);

  if (uiState.error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {uiState.error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{ color: "black" }}
          >
            Invitados
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGuest}
          >
            Crear Nuevo Invitado
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <GuestFilters
          guests={guestData.guests}
          onFilterChange={handleFilterChange}
          tags={guestData.tags}
          allergies={guestData.allergies}
          visibleFilters={visibleFilters}
        />
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <ExcelDownloader data={excelData} fileName="Invitados" />
        </Box>
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={10}
            columnsNum={14}
            height={600}
            showCheckbox={true}
            showActions={true}
          />
        ) : (
          <GuestTable
            guests={filteredGuests}
            onRowClick={handleEditGuest}
            onBulkActionComplete={handleBulkActionComplete}
            onVisibleColumnsChange={handleVisibleColumnsChange}
            sortModel={uiState.sortModel}
            onSortModelChange={(newSortModel) =>
              setUiState((prev) => ({ ...prev, sortModel: newSortModel }))
            }
            visibleColumns={uiState.visibleColumns}
            onDeleteGuest={handleDeleteGuest}
            allergies={guestData.allergies}
          />
        )}
        <GuestModal
          open={uiState.modalOpen}
          onClose={() => setUiState((prev) => ({ ...prev, modalOpen: false }))}
          guest={uiState.selectedGuest}
          onSubmit={handleGuestSubmitted}
          menus={guestData.menus}
          allergies={guestData.allergies}
          tags={guestData.allTags}
          visibleFormFields={visibleFormFields}
        />
        <DeleteConfirmationDialog
          open={uiState.deleteDialogOpen}
          onClose={() =>
            setUiState((prev) => ({ ...prev, deleteDialogOpen: false }))
          }
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación de invitado"
          content={`¿Estás seguro de que quieres eliminar a ${uiState.guestToDelete?.fullName}? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          confirmButtonText="Eliminar invitado"
        />
      </Paper>
    </Container>
  );
};

GuestView.propTypes = {
  visibleColumns: PropTypes.objectOf(PropTypes.bool),
  visibleFilters: PropTypes.objectOf(PropTypes.bool),
  visibleFormFields: PropTypes.objectOf(PropTypes.bool),
};

export default GuestView;