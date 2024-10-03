import React, { useMemo } from "react";
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
import GuestTable from "./GuestViewComponents/GuestTable";
import MobileGuestList from "./GuestViewComponents/MobileGuestList";
import GuestFilters from "./GuestViewComponents/GuestFilters";
import ExcelDownloader from "./GuestViewComponents/ExcelDownloader";
import GuestModal from "./GuestViewComponents/GuestModal";
import SkeletonTable from "../../components/Ui/SkeletonTable/SkeletonTable";
import DeleteConfirmationDialog from "../../components/Ui/DeleteConfirmationDialog/DeleteConfirmationDialog";
import useGuestView from "../../hooks/useGuestView";

const GuestView = ({
  visibleColumns: initialVisibleColumns,
  visibleFilters,
  visibleFormFields,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
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
  } = useGuestView(initialVisibleColumns);

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
    <Container maxWidth={isMobile ? "sm" : "xl"}>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            style={{ color: "black"}}
          >
            Invitados
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGuest}
            sx={{
              fontSize: isMobile ? "0.75rem" : "1rem",
              padding: isMobile ?  "6px 12px" : "8px 16px",
              margin: isMobile ? "0 8px" : "0 16px",
            }}
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
          isMobile={isMobile}
        />
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexDirection={isMobile ? 'column' : 'row'}
        >
          <ExcelDownloader data={excelData} fileName="Invitados" />
          {isMobile && (
            <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
              {filteredGuests.length} invitados encontrados
            </Typography>
          )}
        </Box>
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={10}
            columnsNum={isMobile ? 3 : 14}
            height={600}
            showCheckbox={!isMobile}
            showActions={!isMobile}
          />
        ) : isMobile ? (
          <MobileGuestList
            guests={mobileGuestList}
            onEditGuest={handleEditGuest}
            onDeleteGuest={handleDeleteGuest}
            onBulkActionComplete={handleBulkActionComplete}
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
            visibleColumns={uiState.visibleColumns} 
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
            selectedGuests={selectedGuests}
            setSelectedGuests={setSelectedGuests}
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