import { useState, useEffect, useCallback } from "react";
import { tagService, guestService } from "../services/Api";
import { translateError } from "../config/ErrorMessages";

const useTagView = () => {
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

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
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTag = useCallback(() => {
    setSelectedTag(null);
    setModalOpen(true);
  }, []);

  const handleEditTag = useCallback((tag) => {
    setSelectedTag(tag);
    setModalOpen(true);
  }, []);

  const handleDeleteTag = useCallback(async (tagId) => {
    try {
      await tagService.deleteTag(tagId);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError(translateError(err));
    }
  }, []);

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
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedTag(null);
    setError("");
  }, []);

  return {
    tags,
    guests,
    loading,
    error,
    modalOpen,
    selectedTag,
    handleCreateTag,
    handleEditTag,
    handleDeleteTag,
    handleTagUpdate,
    handleCloseModal,
    setError,
  };
};

export default useTagView;