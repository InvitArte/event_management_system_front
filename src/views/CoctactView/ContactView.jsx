import React from "react";
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import {useContactView} from "../../hooks";
import { SkeletonTable, DeleteConfirmationDialog } from "../../components";
import { ContactFilters, ContactTable, MobileContactList, ContactModal, QRModal } from "./ContactViewComponents";

const ContactView = () => {
  const {
    contactData,
    uiState,
    filteredContacts,
    handleFilterChange,
    handleCreateContact,
    handleEditContact,
    handleDeleteContact,
    handleConfirmDelete,
    handleCloseModal,
    handleSubmitContact,
    handleGenerateQR,
    handleCloseQRModal,
    setUiState,
  } = useContactView();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{ color: "black" }}
          >
            Contactos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateContact}
            sx={{
              fontSize: isSmallScreen ? "0.75rem" : "1rem",
              padding: isSmallScreen ? "6px 12px" : "8px 16px",
              margin: isSmallScreen ? "0 8px" : "0 16px",
            }}
          >
            Crear Nuevo Contacto
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <ContactFilters onFilterChange={handleFilterChange} />
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={6}
            columnsNum={4}
            height={405}
            showCheckbox={false}
            showActions={true}
          />
        ) : isSmallScreen ? (
          <MobileContactList
            contacts={filteredContacts}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            onGenerateQR={handleGenerateQR}
          />
        ) : (
          <ContactTable
            contacts={filteredContacts}
            onRowClick={handleEditContact}
            sortModel={uiState.sortModel}
            onSortModelChange={(newSortModel) =>
              setUiState((prev) => ({ ...prev, sortModel: newSortModel }))
            }
            onDeleteContact={handleDeleteContact}
            onGenerateQR={handleGenerateQR}
          />
        )}
        <ContactModal
          open={uiState.modalOpen}
          onClose={handleCloseModal}
          contact={uiState.selectedContact}
          onSubmit={handleSubmitContact}
        />
        <DeleteConfirmationDialog
          open={uiState.deleteDialogOpen}
          onClose={() =>
            setUiState((prev) => ({ ...prev, deleteDialogOpen: false }))
          }
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación de contacto"
          content={`¿Estás seguro de que quieres eliminar el contacto ${uiState.contactToDelete?.name}? Esta acción no se puede deshacer.`}
          cancelButtonText="Cancelar"
          confirmButtonText="Eliminar contacto"
        />
        <QRModal
          open={uiState.qrModalOpen}
          onClose={handleCloseQRModal}
          vCardData={uiState.vCardData}
        />
      </Paper>
    </Container>
  );
};

export default ContactView;