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
import {useTagView} from "../../hooks";
import {SkeletonTable, DeleteConfirmationDialog} from "../../components";
import {TagTable, TagModal} from "./TagViewComponents";


const TagView = () => {
  const {
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
  } = useTagView();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth={isSmallScreen ? "sm" : "xl"}>
      {uiState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uiState.error}
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
        {uiState.loading ? (
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
        open={uiState.modalOpen}
        onClose={handleCloseModal}
        onTagUpdate={handleTagUpdate}
        tag={uiState.selectedTag}
        guests={guests}
        setError={(error) => setUiState(prev => ({ ...prev, error }))}
      />
      <DeleteConfirmationDialog
        open={uiState.deleteDialogOpen}
        onClose={() => setUiState(prev => ({ ...prev, deleteDialogOpen: false }))}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación de etiqueta"
        content={`¿Estás seguro de que quieres eliminar la etiqueta "${uiState.tagToDelete?.name}"? Esta acción no se puede deshacer.`}
        cancelButtonText="Cancelar"
        confirmButtonText="Eliminar etiqueta"
      />
    </Container>
  );
};

export default TagView;