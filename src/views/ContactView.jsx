/**
 * @file ContactView.jsx
 * @description Componente principal para la vista de contactos. Maneja la lógica de estado,
 * filtrado, y operaciones CRUD para los contactos.
 */

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
import { contactService } from "../services/Api";
import ContactTable from "../components/ContactView/ContactTable";
import ContactFilters from "../components/ContactView/ContactFilters";
import ContactModal from "../components/ContactView/ContactModal";
import QRModal from "../components/ContactView/QRModal";
import SkeletonTable from "../components/Ui/SkeletonTable";
import DeleteConfirmationDialog from "../components/Ui/DeleteConfirmationDialog";
import { normalizeText } from "../components/Utils/TextUtils";
import { generateVCardData } from "../components/Utils/vCardUtils";

/**
 * @function ContactView
 * @description Componente principal que gestiona la vista de contactos.
 * @returns {JSX.Element} Elemento JSX que representa la vista de contactos.
 */
const ContactView = () => {
  /**
   * @typedef {Object} Contact
   * @property {string} id - Identificador único del contacto
   * @property {string} name - Nombre del contacto
   * // Añade más propiedades según la estructura de tus contactos
   */

  /**
   * @typedef {Object} UIState
   * @property {boolean} loading - Indica si se están cargando los datos
   * @property {string} error - Mensaje de error, si lo hay
   * @property {Object} filters - Filtros aplicados a los contactos
   * @property {boolean} modalOpen - Indica si el modal de contacto está abierto
   * @property {Contact|null} selectedContact - Contacto seleccionado para edición
   * @property {Array} sortModel - Modelo de ordenación actual
   * @property {boolean} deleteDialogOpen - Indica si el diálogo de confirmación de eliminación está abierto
   * @property {Contact|null} contactToDelete - Contacto a eliminar
   * @property {boolean} qrModalOpen - Indica si el modal de QR está abierto
   * @property {string} vCardData - Datos de vCard para el QR
   */

  /** @type {[Contact[], function]} */
  const [contactData, setContactData] = useState([]);

  /** @type {[UIState, function]} */
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

  /**
   * @function fetchContacts
   * @description Obtiene los contactos del servicio y actualiza el estado.
   */
  const fetchContacts = useCallback(async () => {
    try {
      const contacts = await contactService.getAllContacts();
      setContactData(contacts);
      setUiState((prev) => ({ ...prev, loading: false, error: "" }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setUiState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch contacts. Please try again later.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /**
   * @type {Contact[]}
   * @description Lista de contactos filtrada según los filtros aplicados.
   */
  const filteredContacts = useMemo(() => {
    return contactData.filter((contact) => {
      return Object.entries(uiState.filters).every(([key, value]) => {
        if (value === null || value === undefined || value === "") return true;
        const contactValue = contact[key];
        return normalizeText(contactValue).includes(normalizeText(value));
      });
    });
  }, [contactData, uiState.filters]);

  /**
   * @function handleFilterChange
   * @description Maneja los cambios en los filtros de contactos.
   * @param {Object} newFilters - Nuevos filtros a aplicar
   */
  const handleFilterChange = useCallback((newFilters) => {
    setUiState((prev) => ({ ...prev, filters: newFilters }));
  }, []);

  /**
   * @function handleCreateContact
   * @description Abre el modal para crear un nuevo contacto.
   */
  const handleCreateContact = useCallback(() => {
    setUiState((prev) => ({ ...prev, selectedContact: null, modalOpen: true }));
  }, []);

  /**
   * @function handleEditContact
   * @description Abre el modal para editar un contacto existente.
   * @param {Contact} contact - Contacto a editar
   */
  const handleEditContact = useCallback((contact) => {
    setUiState((prev) => ({
      ...prev,
      selectedContact: contact,
      modalOpen: true,
    }));
  }, []);

  /**
   * @function handleDeleteContact
   * @description Inicia el proceso de eliminación de un contacto.
   * @param {Contact} contact - Contacto a eliminar
   */
  const handleDeleteContact = useCallback((contact) => {
    setUiState((prev) => ({
      ...prev,
      contactToDelete: contact,
      deleteDialogOpen: true,
    }));
  }, []);

  /**
   * @function handleConfirmDelete
   * @description Confirma y ejecuta la eliminación de un contacto.
   */
  const handleConfirmDelete = useCallback(async () => {
    if (uiState.contactToDelete) {
      try {
        await contactService.deleteContact(uiState.contactToDelete.id);
        await fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      } finally {
        setUiState((prev) => ({
          ...prev,
          deleteDialogOpen: false,
          contactToDelete: null,
        }));
      }
    }
  }, [uiState.contactToDelete, fetchContacts]);

  /**
   * @function handleCloseModal
   * @description Cierra el modal de contacto.
   */
  const handleCloseModal = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      modalOpen: false,
      selectedContact: null,
    }));
  }, []);

  /**
   * @function handleSubmitContact
   * @description Maneja la submisión de un contacto (creación o edición).
   */
  const handleSubmitContact = useCallback(async () => {
    await fetchContacts();
    handleCloseModal();
  }, [fetchContacts, handleCloseModal]);

  /**
   * @function handleGenerateQR
   * @description Genera datos vCard y abre el modal de QR.
   * @param {Contact} contact - Contacto para generar el QR
   */
  const handleGenerateQR = useCallback((contact) => {
    const vCardData = generateVCardData(contact);
    setUiState((prev) => ({
      ...prev,
      qrModalOpen: true,
      vCardData: vCardData,
    }));
  }, []);

  /**
   * @function handleCloseQRModal
   * @description Cierra el modal de QR.
   */
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
          >
            Crear Nuevo Contacto
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <ContactFilters onFilterChange={handleFilterChange} />
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={6}
            columnsNum={4}
            height={405}
            showCheckbox={false}
            showActions={true}
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
