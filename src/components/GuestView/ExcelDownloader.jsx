import React from 'react';
import { Button } from '@mui/material';
import ExcelJS from 'exceljs';

const ExcelDownloader = ({ data, fileName }) => {
  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invitados');

    // Definir las columnas
    worksheet.columns = [
    //   { header: 'ID', key: 'ID', width: 10 },
      { header: 'Nombre Completo', key: 'Nombre Completo', width: 30 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Teléfono', key: 'Teléfono', width: 15 },
      { header: 'Validado', key: 'Validado', width: 10 },
      { header: 'Menú', key: 'Menú', width: 20 },
      { header: 'Alergia', key: 'Alergia', width: 20 },
      { header: 'Necesita Hotel', key: 'Necesita Hotel', width: 15 },
      { header: 'Necesita Transporte', key: 'Necesita Transporte', width: 20 },
      { header: 'Discapacidad', key: 'Discapacidad', width: 15 },
      { header: 'Plan de Alojamiento', key: 'Plan de Alojamiento', width: 30 },
      { header: 'Tipo', key: 'Tipo', width: 20 }
    ];

    // Añadir los datos
    worksheet.addRows(data);

    // Estilo para las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });
      if (rowNumber === 1) {
        row.font = { bold: true };
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD3D3D3' }
        };
      }
    });

    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button variant="contained" color="primary" onClick={downloadExcel}>
      Descargar Excel
    </Button>
  );
};

export default ExcelDownloader;