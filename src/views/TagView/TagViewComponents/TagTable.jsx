// React y hooks
import React, { useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { IconButton, Box, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

// Configuración
import { DataGridLocaleText } from "../../../config";

const TagTable = ({ tags = [], guests = [], onEditTag, onDeleteTag }) => {
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
        field: "totalGuests",
        headerName: "Total Invitados",
        width: 150,
        renderCell: (params) => {
          const tagGuests = guests.filter(guest =>
            guest.tags.some(tag => tag.id === params.row.id)
          );
          const totalGuests = tagGuests.reduce((total, guest) => {
            return total + 1 + (guest.plus_ones ? guest.plus_ones.length : 0);
          }, 0);
          return totalGuests;
        },
      },
      {
        field: "guests",
        headerName: "Invitados Principales",
        flex: 1,
        renderCell: (params) => {
          const tagGuests = guests.filter(guest =>
            guest.tags.some(tag => tag.id === params.row.id)
          );
          const guestNames = tagGuests.map(guest => `${guest.first_name} ${guest.last_name}`).join(", ");
          return (
            <Tooltip title={guestNames} arrow>
              <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {guestNames || "Sin invitados"}
              </Box>
            </Tooltip>
          );
        },
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
    [onDeleteTag, guests]
  );

  return (
    <Box sx={{ height: 600, width: "100%" }}>
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
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      plus_ones: PropTypes.arrayOf(PropTypes.object),
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          name: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  onEditTag: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
};

export default TagTable;
