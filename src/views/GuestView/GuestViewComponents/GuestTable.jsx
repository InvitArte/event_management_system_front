// React y hooks
import React, { useState, useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";

// Material-UI
import { Box, Checkbox, Chip, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

// Configuración
import { DataGridLocaleText } from "../../../config";

// Componentes genericos
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../../../components";

//Componentes propios
import BulkActions from "./BulkActions";

// Assets y estilos
import "../../../styles/GuestView/Datatable.css";

const GuestTable = ({
  guests,
  onRowClick,
  onBulkActionComplete,
  onVisibleColumnsChange,
  sortModel,
  onSortModelChange,
  visibleColumns,
  onDeleteGuest,
}) => {
  const [selectedGuests, setSelectedGuests] = useState([]);

  const handleSelectionReset = useCallback(() => {
    setSelectedGuests([]);
  }, []);

  const handleSelectGuest = useCallback((guest) => {
    setSelectedGuests((prev) => {
      const isSelected = prev.some((g) => g.id === guest.id);
      return isSelected
        ? prev.filter((g) => g.id !== guest.id)
        : [...prev, guest];
    });
  }, []);

  const handleSelectAllClick = useCallback(
    (event) => {
      setSelectedGuests(
        event.target.checked ? guests.filter((g) => g.isMainGuest) : []
      );
    },
    [guests]
  );

  const handleRowClick = useCallback(
    (params) => {
      if (params.field !== "select" && params.row.isMainGuest) {
        onRowClick(params.row);
      }
    },
    [onRowClick]
  );

  const getRowClassName = useCallback(
    (params) => {
      const groupIndex = guests
        .filter((g) => g.isMainGuest)
        .findIndex(
          (g) =>
            g.id ===
            (params.row.isMainGuest ? params.row.id : params.row.parentId)
        );
      const baseClass = groupIndex % 2 === 0 ? "even-group" : "odd-group";
      return params.row.isMainGuest ? baseClass : `${baseClass} plus-one-row`;
    },
    [guests]
  );

  const getRowId = useCallback((row) => {
    return row.isMainGuest ? `main-${row.id}` : `plus-one-${row.id}`;
  }, []);

  const columns = useMemo(
    () => [
      {
        field: "select",
        headerName: "Seleccionar",
        width: 100,
        renderHeader: () => (
          <Checkbox
            checked={
              selectedGuests.length ===
              guests.filter((g) => g.isMainGuest).length
            }
            indeterminate={
              selectedGuests.length > 0 &&
              selectedGuests.length < guests.filter((g) => g.isMainGuest).length
            }
            onChange={handleSelectAllClick}
          />
        ),
        renderCell: (params) => (
          <Checkbox
            checked={selectedGuests.some((g) => g.id === params.row.id)}
            onChange={() => handleSelectGuest(params.row)}
            disabled={!params.row.isMainGuest}
          />
        ),
      },
      {
        field: "validated",
        headerName: "Validado",
        width: 100,
        type: "boolean",
      },
      {
        field: "fullName",
        headerName: "Nombre completo",
        width: 200,
        renderCell: (params) => (
          <Box sx={{ paddingLeft: params.row.isMainGuest ? 0 : 4 }}>
            {params.row.isMainGuest ? params.value : `↳ ${params.value}`}
          </Box>
        ),
      },
      { field: "email", headerName: "Correo", width: 200 },
      { field: "phone", headerName: "Teléfono", width: 150 },
      { field: "menu", headerName: "Menú", width: 150 },
      {
        field: "allergies",
        headerName: "Alergias",
        width: 200,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {params.value?.map((allergy) => (
              <Chip key={allergy.id} label={allergy.name} size="small" />
            ))}
          </Box>
        ),
      },
      {
        field: "needs_hotel",
        headerName: "Necesita hotel",
        width: 120,
        type: "boolean",
      },
      {
        field: "needs_transport",
        headerName: "Necesita transporte",
        width: 150,
        type: "boolean",
      },
      {
        field: "needs_transport_back",
        headerName: "Necesita transporte de vuelta",
        width: 150,
        type: "boolean",
      },
      {
        field: "disability",
        headerName: "Discapacidad",
        width: 100,
        type: "boolean",
      },
      { field: "accommodation_plan", headerName: "Estancia", width: 200 },
      {
        field: "tags",
        headerName: "Etiquetas",
        width: 240,
        renderCell: (params) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {params.value?.map((tag) => {
              const backgroundColor = stringToColor(tag.name);
              const textColor = getContrastColor(backgroundColor);
              return (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  style={{
                    backgroundColor: adjustColor(backgroundColor, 20),
                    color: textColor,
                  }}
                />
              );
            })}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 100,
        renderCell: (params) => {
          if (params.row.isMainGuest) {
            return (
              <Tooltip title="Eliminar invitado">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGuest(params.row);
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            );
          }
          return null;
        },
      },
    ],
    [
      selectedGuests,
      guests,
      handleSelectAllClick,
      handleSelectGuest,
      onDeleteGuest,
    ]
  );

  return (
    <Box>
      <BulkActions
        selectedGuests={selectedGuests}
        onBulkActionComplete={onBulkActionComplete}
        onSelectionReset={handleSelectionReset}
      />
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={guests}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          onCellClick={handleRowClick}
          getRowClassName={getRowClassName}
          getRowId={getRowId}
          onColumnVisibilityModelChange={onVisibleColumnsChange}
          columnVisibilityModel={visibleColumns}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          localeText={DataGridLocaleText}
        />
      </div>
    </Box>
  );
};

GuestTable.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      isMainGuest: PropTypes.bool.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      menu: PropTypes.string,
      allergy: PropTypes.string,
      needs_hotel: PropTypes.bool,
      needs_transport: PropTypes.bool,
      disability: PropTypes.bool,
      accommodation_plan: PropTypes.string,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
  onBulkActionComplete: PropTypes.func.isRequired,
  onVisibleColumnsChange: PropTypes.func.isRequired,
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(["asc", "desc"]).isRequired,
    })
  ).isRequired,
  onSortModelChange: PropTypes.func.isRequired,
  visibleColumns: PropTypes.object.isRequired,
  onDeleteGuest: PropTypes.func.isRequired,
};

export default GuestTable;
