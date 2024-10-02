import { useState, useEffect, useMemo, useCallback } from "react";
import { contactService } from "../services/Api";
import { normalizeText } from "../components/Utils/TextUtils";
import { generateVCardData } from "../components/Utils/vCardUtils";

const useContactView = () => {
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
        error: "Error al cargar los contactos, por favor inténtelo de nuevo.",
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

  return {
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
  };
};

export default useContactView;