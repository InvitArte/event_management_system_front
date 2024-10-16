// React y hooks
import React from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete as DeleteIcon, QrCode as QrCodeIcon } from "@mui/icons-material";

// Configuración
import { DataGridLocaleText } from "../../../config";

const ContactTable = ({
  contacts,
  onRowClick,
  sortModel,
  onSortModelChange,
  onDeleteContact,
  onGenerateQR,
}) => {
  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Teléfono", flex: 1 },
    { field: "description", headerName: "Descripción", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onGenerateQR(params.row);
            }}
            size="small"
          >
            <QrCodeIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteContact(params.row);
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
      flex: 1,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={contacts}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        onRowClick={(params) => onRowClick(params.row)}
        localeText={DataGridLocaleText}
      />
    </div>
  );
};

ContactTable.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(["asc", "desc"]).isRequired,
    })
  ).isRequired,
  onSortModelChange: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
  onGenerateQR: PropTypes.func.isRequired,
};

export default ContactTable;