import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { tagService, guestService } from "../../services/Api";
import TagTable from "./TagViewComponents/TagTable";
import TagModal from "./TagViewComponents/TagModal";
import SkeletonTable from "../../components/Ui/SkeletonTable";
import { translateError } from "../../config/ErrorMessages";

const TagView = () => {
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = useCallback(async () => {
    try {
      const [tagsResponse, guestsResponse] = await Promise.all([
        tagService.getAllTags(),
        guestService.getAllGuests(),
      ]);
      setTags(tagsResponse);
      setGuests(guestsResponse);
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

  const handleCreateTag = () => {
    setSelectedTag(null);
    setModalOpen(true);
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await tagService.deleteTag(tagId);
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError(translateError(err));
    }
  };

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

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTag(null);
    setError("");
  };

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            style={{ color: "black" }}
          >
            Etiquetas
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateTag}   sx={{
              fontSize: isSmallScreen ? "0.75rem" : "1rem",
              padding: isSmallScreen ? "6px 12px" : "8px 16px",
              margin: isSmallScreen ? "0 8px" : "0 16px",
            }}>
            Crear Nueva Etiqueta
          </Button>
        </Box>
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        {loading ? (
          <SkeletonTable
            rowsNum={5}
            columnsNum={1}
            height={400}
            showCheckbox={false}
            showActions={true}
          />
        ) : (
          <TagTable
            tags={tags}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
          />
        )}
      </Paper>
      <TagModal
        open={modalOpen}
        onClose={handleCloseModal}
        onTagUpdate={handleTagUpdate}
        tag={selectedTag}
        guests={guests}
      />
    </Container>
  );
};

export default TagView;
