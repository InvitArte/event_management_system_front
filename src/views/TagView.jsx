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
      await fetchData();
    } catch (err) {
      console.error("Error deleting tag:", err);
      setError("Failed to delete tag. Please try again.");
    }
  };

  const handleSubmitTag = async (tagData, selectedGuests) => {
    try {
      let response;
      if (selectedTag) {
        response = await tagService.updateTag(selectedTag.id, tagData);
        await tagService.bulkAssign(
          selectedTag.id,
          selectedGuests.map((g) => g.id)
        );
      } else {
        response = await tagService.createTag(tagData);
      }
      await fetchData();
      setModalOpen(false);
      return response;
    } catch (err) {
      console.error("Error submitting tag:", err);
      setError("Failed to submit tag. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

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
        <TagTable
          tags={tags}
          onEditTag={handleEditTag}
          onDeleteTag={handleDeleteTag}
        />
      </Paper>
      <TagModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTag}
        tag={selectedTag}
        guests={guests}
      />
    </Container>
  );
};

export default TagView;
