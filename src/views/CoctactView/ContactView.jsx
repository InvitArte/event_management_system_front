import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import { contactService } from "../../services/Api";
import ContactTable from "./ContactViewComponents/ContactTable";
import MobileContactList from "./ContactViewComponents/MobileContactList"; 
import ContactFilters from "./ContactViewComponents/ContactFilters";
import ContactModal from "./ContactViewComponents/ContactModal";
import QRModal from "./ContactViewComponents/QRModal";
import SkeletonTable from "../../components/Ui/SkeletonTable";
import DeleteConfirmationDialog from "../../components/Ui/DeleteConfirmationDialog";
import { normalizeText } from "../../components/Utils/TextUtils";
import { generateVCardData } from "../../components/Utils/vCardUtils";

const ContactView = () => {
  const [contactData, setContactData] = useState([]);
  const [uiState, setUiState] = useState({
    loading: true,
    error: "",
    filters: {},
    modalOpen: false,
    selectedContact: null,
    sortModel: [],
    deleteDialogOpen: false,
    contactToDelete: null,
    qrModalOpen: false,
    vCardData: "",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchContacts = useCallback(async () => {
    try {
      const contacts = await contactService.getAllContacts();
      setContactData(contacts);
      setUiState((prev) => ({ ...prev, loading: false, error: "" }));
    } catch (error) {
      console.error("Error al cargar los contactos:", error);
      setUiState((prev) => ({
        ...prev,
        loading: false,
        error: "Erorr al cargar los contactos, por favor intentelo de nuevo.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filteredContacts = useMemo(() => {
    return contactData.filter((contact) => {
      return Object.entries(uiState.filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;
        const contactValue = contact[key];
        return normalizeText(contactValue).includes(normalizeText(value));
      });
    });
  }, [contactData, uiState.filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setUiState((prev) => ({ ...prev, filters: newFilters }));
  }, []);

  const handleCreateContact = useCallback(() => {
    setUiState((prev) => ({ ...prev, selectedContact: null, modalOpen: true }));
  }, []);

  const handleEditContact = useCallback((contact) => {
    setUiState((prev) => ({
      ...prev,
      selectedContact: contact,
      modalOpen: true,
    }));
  }, []);

  const handleDeleteContact = useCallback((contact) => {
    setUiState((prev) => ({
      ...prev,
      contactToDelete: contact,
      deleteDialogOpen: true,
    }));
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (uiState.contactToDelete) {
      try {
        await contactService.deleteContact(uiState.contactToDelete.id);
        await fetchContacts();
      } catch (error) {
        console.error("Error borrando el contacto:", error);
      } finally {
        setUiState((prev) => ({
          ...prev,
          deleteDialogOpen: false,
          contactToDelete: null,
        }));
      }
    }
  }, [uiState.contactToDelete, fetchContacts]);

  const handleCloseModal = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      modalOpen: false,
      selectedContact: null,
    }));
  }, []);

  const handleSubmitContact = useCallback(async () => {
    await fetchContacts();
    handleCloseModal();
  }, [fetchContacts, handleCloseModal]);

  const handleGenerateQR = useCallback((contact) => {
    const vCardData = generateVCardData(contact);
    setUiState((prev) => ({
      ...prev,
      qrModalOpen: true,
      vCardData: vCardData,
    }));
  }, []);
  const handleCloseQRModal = useCallback(() => {
    setUiState((prev) => ({ ...prev, qrModalOpen: false, vCardData: "" }));
  }, []);

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