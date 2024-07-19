import React, { useState, useCallback, useEffect } from 'react';
import { Box, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BulkActions from './BulkActions';
import "../../styles/GuestView/Datatable.css";

const GuestTable = ({ guests, onRowClick, onBulkActionComplete }) => {
  const [selectedGuests, setSelectedGuests] = useState([]);

  const columns = [
    {
      field: 'select',
      headerName: 'Seleccionar',
      width: 100,
      renderCell: (params) => (
        <Checkbox
          checked={selectedGuests.some(g => g.id === params.row.id)}
          onChange={() => handleSelectGuest(params.row)}
          disabled={!params.row.isMainGuest}
        />
      ),
    },
    { 
      field: 'fullName', 
      headerName: 'Nombre completo', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ paddingLeft: params.row.isMainGuest ? 0 : 4 }}>
          {params.row.isMainGuest ? params.value : `↳ ${params.value}`}
        </Box>
      )
    },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 150 },
    { field: 'validated', headerName: 'Validado', width: 100, type: 'boolean' },
    { field: 'menu', headerName: 'Menú', width: 150 },
    { field: 'allergy', headerName: 'Alergias', width: 150 },
    { field: 'needs_hotel', headerName: 'Necesita hotel', width: 120, type: 'boolean' },
    { field: 'needs_transport', headerName: 'Necesita transporte', width: 150, type: 'boolean' },
    { field: 'disability', headerName: 'Discapacidad', width: 100, type: 'boolean' },
    { field: 'accommodation_plan', headerName: 'Estancia', width: 200 },
  ];

  const handleSelectGuest = useCallback((guest) => {
    console.log("Attempting to select/deselect guest:", guest);
    setSelectedGuests(prev => {
      const isSelected = prev.some(g => g.id === guest.id);
      const newSelection = isSelected
        ? prev.filter(g => g.id !== guest.id)
        : [...prev, guest];
      console.log("New selection:", newSelection);
      return newSelection;
    });
  }, []);

  const handleRowClick = useCallback((params) => {
    if (params.field !== 'select' && params.row.isMainGuest) {
      onRowClick(params.row);
    }
  }, [onRowClick]);

  useEffect(() => {
    console.log("Selected Guests Updated:", selectedGuests);
  }, [selectedGuests]);

  const getRowClassName = (params) => {
    const groupIndex = getGroupIndex(params.row.isMainGuest ? params.row.id : params.row.parentId);
    if (params.row.isMainGuest) {
      return groupIndex % 2 === 0 ? 'even-group' : 'odd-group';
    } else {
      return groupIndex % 2 === 0 ? 'even-group plus-one-row' : 'odd-group plus-one-row';
    }
  };

  // Función para determinar el índice del grupo basado en el ID del invitado principal
  const getGroupIndex = (mainGuestId) => {
    const mainGuestIds = guests.filter(g => g.isMainGuest).map(g => g.id);
    return mainGuestIds.indexOf(mainGuestId);
  };

  return (
    <Box>
      <BulkActions 
        selectedGuests={selectedGuests} 
        onBulkActionComplete={onBulkActionComplete} 
      />
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={guests}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          onCellClick={handleRowClick}
          getRowClassName={getRowClassName}
          getRowId={(row) => row.id}
        />
      </div>
    </Box>
  );
};

export default GuestTable;
