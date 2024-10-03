import { useState, useEffect, useCallback } from "react";
import { tagService, guestService } from "../services/Api";
import { translateError } from "../config/ErrorMessages";

const useTagView = () => {
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);
  const [uiState, setUiState] = useState({
    loading: true,
    error: "",
    modalOpen: false,
    selectedTag: null,
    deleteDialogOpen: false,
    tagToDelete: null,
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

  const handleTagUpdate = useCallback((updatedTag) => {
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

  const setError = useCallback((error) => {
    setUiState(prev => ({ ...prev, error }));
  }, []);

  return {
    tags,
    guests,
    uiState,
    handleCreateTag,
    handleEditTag,
    handleDeleteTag,
    handleConfirmDelete,
    handleTagUpdate,
    handleCloseModal,
    setUiState,
    setError,
  };
};

export default useTagView;