import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { dataGridLocaleText } from "../Ui/DataGridLocaleText";
import DeleteIcon from "@mui/icons-material/Delete";

const TagTable = ({ tags, onEditTag, onDeleteTag }) => {
  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
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
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={tags}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => onEditTag(params.row)}
        disableSelectionOnClick
        localeText={dataGridLocaleText}
      />
    </div>
  );
};

export default TagTable;
