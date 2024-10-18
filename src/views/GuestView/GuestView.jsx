import React, { useMemo, useState, useCallback } from "react";
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
import { useGuestView } from "../../hooks";
import { SkeletonTable, DeleteConfirmationDialog, ExcelDownloader  } from "../../components";
import {
  GuestFilters,
  GuestModal,
  GuestTable,
  MobileGuestList
} from "./GuestViewComponents";
import { TagModal } from "../TagView/TagViewComponents";

const GuestView = ({
  visibleColumns: initialVisibleColumns,
  visibleFilters,
  visibleFormFields,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tagModalOpen, setTagModalOpen] = useState(false);

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
    updateTags,
    excelData,
    excelColumnWidths,
    columns,
  } = useGuestView(initialVisibleColumns);

  const handleOpenTagModal = useCallback(() => {
    setTagModalOpen(true);
  }, []);

  const handleCloseTagModal = useCallback(() => {
    setTagModalOpen(false);
  }, []);

  const handleTagUpdate = useCallback((updatedTag) => {
    updateTags(updatedTag);
    handleCloseTagModal();
  }, [updateTags, handleCloseTagModal]);

  const visibleExcelData = useMemo(() => {
    return excelData.map(row =>
      Object.fromEntries(
        Object.entries(row).filter(([key]) => {
          const column = columns.find(col => col.headerName === key);
          return column && uiState.visibleColumns[column.field];
        })
      )
    );
  }, [excelData, columns, uiState.visibleColumns]);

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
            style={{ color: "black" }}
          >
            Invitados
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateGuest}
            sx={{
              fontSize: isMobile ? "0.75rem" : "1rem",
              padding: isMobile ? "6px 12px" : "8px 16px",
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
          <ExcelDownloader
            data={visibleExcelData}
            fileName="Invitados"
            columnWidths={excelColumnWidths}
          />
          {isMobile && (
            <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
              {filteredGuests.length} invitados encontrados
            </Typography>
          )}
        </Box>
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={8}
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
          allAllergies={guestData.allAllergies}
          tags={guestData.allTags}
          allTags={guestData.allTags}
          visibleFormFields={visibleFormFields}
          onOpenTagModal={handleOpenTagModal}
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
        <TagModal
          open={tagModalOpen}
          onClose={handleCloseTagModal}
          onTagUpdate={handleTagUpdate}
          tag={null}
          guests={guestData.guests}
          setError={(error) => setUiState((prev) => ({ ...prev, error }))}
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