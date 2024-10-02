import React from "react";
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
import TagTable from "./TagViewComponents/TagTable";
import TagModal from "./TagViewComponents/TagModal";
import SkeletonTable from "../../components/Ui/SkeletonTable";
import useTagView from "../../hooks/useTagView";

const TagView = () => {
  const {
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
  } = useTagView();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateTag}
            sx={{
              fontSize: isSmallScreen ? "0.75rem" : "1rem",
              padding: isSmallScreen ? "6px 12px" : "8px 16px",
              margin: isSmallScreen ? "0 8px" : "0 16px",
            }}
          >
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
        setError={setError}
      />
    </Container>
  );
};

export default TagView;