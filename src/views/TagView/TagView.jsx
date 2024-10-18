// React
import React from "react";

// Material-UI
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

// Hooks propios
import { useTagView } from "../../hooks";

// Componentes genéricos
import { SkeletonTable, DeleteConfirmationDialog,ExcelDownloader } from "../../components";

// Componentes propios
import { TagTable, TagModal, MobileTagList, TagFilters } from "./TagViewComponents";

const TagView = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    tags,
    guests,
    filteredTags,
    uiState,
    handleCreateTag,
    handleEditTag,
    handleDeleteTag,
    handleConfirmDelete,
    handleTagUpdate,
    handleCloseModal,
    handleFilterChange,
    setUiState,
    excelData,
    excelColumnWidths,
  } = useTagView();

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
        <TagFilters
          tags={tags}
          guests={guests}
          onFilterChange={handleFilterChange}
          visibleFilters={{ tag_name: true, guest_name: true }}
        />
      </Paper>
      <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexDirection={isSmallScreen ? 'column' : 'row'}
        >
          <ExcelDownloader
            data={excelData}
            fileName="Etiquetas"
            columnWidths={excelColumnWidths}
          />
          {isSmallScreen && (
            <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
              {filteredTags.length} etiquetas encontradas
            </Typography>
          )}
        </Box>
        {uiState.loading ? (
          <SkeletonTable
            rowsNum={4}
            columnsNum={isSmallScreen ? 2 : 4}
            height={400}
            showCheckbox={false}
            showActions={true}
          />
        ) : isSmallScreen ? (
          <MobileTagList
            tags={filteredTags}
            guests={guests}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
          />
        ) : (
          <TagTable
            tags={filteredTags}
            guests={guests}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
            sortModel={uiState.sortModel}
            onSortModelChange={(newSortModel) =>
              setUiState((prev) => ({ ...prev, sortModel: newSortModel }))
            }
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