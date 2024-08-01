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
import { guestService, tagService } from "../services/Api";
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
      const [guestsResponse, tagsResponse] = await Promise.all([
        guestService.getAllGuests(),
        tagService.getAllTags(),
      ]);
      return { guests: guestsResponse, tags: tagsResponse };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }, []);

  const processGuests = useCallback((guestsData) => {
    if (!Array.isArray(guestsData)) {
      console.error("guestsData is not an array:", guestsData);
      return { guests: [], menus: [], allergies: [], tags: [] };
    }

    const uniqueMenus = new Set();
    const uniqueAllergies = new Set();
    const uniqueTags = new Set();

    const processedGuests = guestsData.flatMap((guest) => {
      if (guest.menu) {
        uniqueMenus.add(JSON.stringify(guest.menu));
      }
      if (guest.allergy) {
        uniqueAllergies.add(JSON.stringify(guest.allergy));
      }
      guest.tags?.forEach((tag) => {
        uniqueTags.add(JSON.stringify(tag));
      });

      const mainGuest = {
        id: guest.id,
        fullName: `${guest.first_name} ${guest.last_name}`.trim(),
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email || "",
        phone: guest.phone || "",
        validated: Boolean(guest.validated),
        menu: guest.menu?.name || "No ha especificado",
        menu_id: guest.menu_id,
        allergy: guest.allergy?.name || "No",
        allergy_id: guest.allergy_id,
        needs_hotel: Boolean(guest.needs_hotel),
        needs_transport: Boolean(guest.needs_transport),
        disability: Boolean(guest.disability),
        observations: guest.observations || "",
        accommodation_plan: guest.accommodation_plan || "No ha especificado",
        isMainGuest: true,
        plus_ones: guest.plus_ones || [],
        tags: guest.tags || [],
      };

      const plusOnes =
        guest.plus_ones?.map((plusOne) => ({
          id: plusOne.id,
          fullName: `${plusOne.first_name} ${plusOne.last_name}`.trim(),
          first_name: plusOne.first_name,
          last_name: plusOne.last_name,
          email: plusOne.email || "",
          phone: plusOne.phone || "",
          validated: Boolean(guest.validated),
          menu: plusOne.menu?.name || "No ha especificado",
          menu_id: plusOne.menu_id,
          allergy: plusOne.allergy?.name || "No",
          allergy_id: plusOne.allergy_id,
          needs_hotel: Boolean(guest.needs_hotel),
          needs_transport: Boolean(guest.needs_transport),
          disability: Boolean(plusOne.disability),
          observations: plusOne.observations || "",
          accommodation_plan: guest.accommodation_plan || "No ha especificado",
          isMainGuest: false,
          parentId: guest.id,
          tags: [],
        })) || [];

      return [mainGuest, ...plusOnes];
    });

    return {
      guests: processedGuests,
      menus: Array.from(uniqueMenus).map((menu) => JSON.parse(menu)),
      allergies: Array.from(uniqueAllergies).map((allergy) =>
        JSON.parse(allergy)
      ),
      tags: Array.from(uniqueTags).map((tag) => JSON.parse(tag)),
    };
  }, []);

  const processData = useCallback(
    (data) => {
      const processedGuests = processGuests(data.guests);
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
    return guestData.guests.filter((guest) => {
      return Object.entries(uiState.filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;

        switch (key) {
          case "needs_hotel":
          case "needs_transport":
          case "validated":
            return guest[key] === (value === "Sí");
          case "allergy":
            return guest[key]?.toLowerCase().includes(value.toLowerCase());
          case "tags":
            return value.every((tag) =>
              guest.tags?.some(
                (guestTag) => guestTag.name.toLowerCase() === tag.toLowerCase()
              )
            );
          case "accommodation_plan":
            return guest[key]?.toLowerCase() === value.toLowerCase();
          case "full_name":
            return normalizeText(guest.fullName).includes(value);
          default:
            return guest[key]?.toLowerCase().includes(value.toLowerCase());
        }
      });
    });
  }, [guestData.guests, uiState.filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setUiState((prev) => ({ ...prev, filters: newFilters }));
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
    { field: "allergy", headerName: "Alergia" },
    { field: "needs_hotel", headerName: "Necesita Hotel" },
    { field: "needs_transport", headerName: "Necesita Transporte" },
    { field: "disability", headerName: "Discapacidad" },
    { field: "observations", headerName: "Observaciones" },
    { field: "accommodation_plan", headerName: "Plan de Alojamiento" },
    { field: "isMainGuest", headerName: "Tipo" },
    { field: "tags", headerName: "Etiquetas" },
  ];

  const excelData = useMemo(() => {
    let sortedGuests = [...filteredGuests];
    if (uiState.sortModel.length > 0) {
      const { field, sort } = uiState.sortModel[0];
      sortedGuests.sort((a, b) => {
        if (a[field] < b[field]) return sort === "asc" ? -1 : 1;
        if (a[field] > b[field]) return sort === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortedGuests.map((guest) => {
      const rowData = {
        ID: guest.id,
        "Nombre Completo": guest.fullName,
        Email: guest.email,
        Teléfono: guest.phone,
        Validado: guest.validated ? "Sí" : "No",
        Menú: guest.menu,
        Alergia: guest.allergy,
        "Necesita Hotel": guest.needs_hotel ? "Sí" : "No",
        "Necesita Transporte": guest.needs_transport ? "Sí" : "No",
        Discapacidad: guest.disability ? "Sí" : "No",
        Observaciones: guest.observations,
        "Plan de Alojamiento": guest.accommodation_plan,
        Tipo: guest.isMainGuest ? "Invitado Principal" : "Acompañante",
        Etiquetas: guest.tags.map((tag) => tag.name).join(", "),
      };

      return Object.keys(rowData).reduce((acc, key) => {
        const columnField = columns.find(
          (col) => col.headerName === key
        )?.field;
        if (columnField && uiState.visibleColumns[columnField]) {
          acc[key] = rowData[key];
        }
        return acc;
      }, {});
    });
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
          visibleFilters={visibleFilters}
        />
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
            columnsNum={13}
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
