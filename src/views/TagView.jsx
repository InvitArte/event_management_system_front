import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
} from "@mui/material";
import { tagService, guestService } from "../services/api";
import TagTable from "../components/TagView/TagTable";
import TagModal from "../components/TagView/TagModal";
import SkeletonTable from "../components/Ui/SkeletonTable";

const TagView = () => {
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tagsResponse, guestsResponse] = await Promise.all([
        tagService.getAllTags(),
        guestService.getAllGuests(),
      ]);
      setTags(tagsResponse);
      setGuests(guestsResponse);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

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
      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError("Failed to delete tag. Please try again.");
    }
  };

  const handleTagUpdate = (updatedTag) => {
    setTags((prevTags) => {
      const index = prevTags.findIndex((tag) => tag.id === updatedTag.id);
      if (index !== -1) {
        // Update existing tag
        return [
          ...prevTags.slice(0, index),
          updatedTag,
          ...prevTags.slice(index + 1),
        ];
      } else {
        // Add new tag
        return [...prevTags, updatedTag];
      }
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTag(null);
    setError("");
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
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
            Etiquetas
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCreateTag}>
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
