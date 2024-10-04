// React y hooks
import React, { useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { IconButton, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

// Configuración
import { DataGridLocaleText } from "../../../config";

const TagTable = ({ tags = [], onEditTag, onDeleteTag }) => {
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Nombre",
        flex: 1,
        renderCell: (params) => (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              "&:hover": { cursor: "pointer" },
            }}
          >
            {params.value}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag(params.row);
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [onDeleteTag]
  );

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tags}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => onEditTag(params.row)}
        disableSelectionOnClick
        localeText={DataGridLocaleText}
      />
    </Box>
  );
};

TagTable.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onEditTag: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
};

export default TagTable;
