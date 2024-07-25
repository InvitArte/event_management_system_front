import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { dataGridLocaleText } from "../Ui/DataGridLocaleText";

const TagTable = ({ tags, onEditTag, onDeleteTag }) => {
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
              onDeleteTag(params.row.id);
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
        localeText={dataGridLocaleText}
      />
    </Box>
  );
};

export default TagTable;
