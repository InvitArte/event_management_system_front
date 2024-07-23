import React, { useState, useCallback, useEffect } from "react";
import { Box, Checkbox, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BulkActions from "./BulkActions";
import {
  stringToColor,
  adjustColor,
  getContrastColor,
} from "../Utils/tagColors";
import { dataGridLocaleText } from "../Ui/dataGridLocaleText";
import "../../styles/GuestView/Datatable.css";

const GuestTable = ({
  guests,
  onRowClick,
  onBulkActionComplete,
  onVisibleColumnsChange,
  sortModel,
  onSortModelChange,
  visibleColumns,
}) => {
  const [selectedGuests, setSelectedGuests] = useState([]);

  const columns = [
    {
      field: "select",
      headerName: "Seleccionar",
      width: 100,
      renderHeader: (params) => (
        <Checkbox
          checked={
            selectedGuests.length === guests.filter((g) => g.isMainGuest).length
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
    { field: "validated", headerName: "Validado", width: 100, type: "boolean" },
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
    { field: "allergy", headerName: "Alergias", width: 150 },
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
      field: "disability",
      headerName: "Discapacidad",
      width: 100,
      type: "boolean",
    },
    { field: "accommodation_plan", headerName: "Estancia", width: 200 },
    {
      field: "tags",
      headerName: "Etiquetas",
      width: 300,
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
  ];

  const handleColumnVisibilityChange = (newModel) => {
    onVisibleColumnsChange(newModel);
  };

  const handleSelectGuest = useCallback((guest) => {
    setSelectedGuests((prev) => {
      const isSelected = prev.some((g) => g.id === guest.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== guest.id);
      } else {
        return [...prev, guest];
      }
    });
  }, []);

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelectedGuests = guests.filter((g) => g.isMainGuest);
        setSelectedGuests(newSelectedGuests);
      } else {
        setSelectedGuests([]);
      }
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

  const getRowClassName = (params) => {
    const groupIndex = getGroupIndex(
      params.row.isMainGuest ? params.row.id : params.row.parentId
    );
    if (params.row.isMainGuest) {
      return groupIndex % 2 === 0 ? "even-group" : "odd-group";
    } else {
      return groupIndex % 2 === 0
        ? "even-group plus-one-row"
        : "odd-group plus-one-row";
    }
  };

  const getGroupIndex = (mainGuestId) => {
    const mainGuestIds = guests.filter((g) => g.isMainGuest).map((g) => g.id);
    return mainGuestIds.indexOf(mainGuestId);
  };

  return (
    <Box>
      <BulkActions
        selectedGuests={selectedGuests}
        onBulkActionComplete={onBulkActionComplete}
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
          getRowId={(row) => row.id}
          onColumnVisibilityModelChange={handleColumnVisibilityChange}
          columnVisibilityModel={visibleColumns}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          localeText={dataGridLocaleText}
        />
      </div>
    </Box>
  );
};

export default GuestTable;
