//React y hooks
import React, { useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";
import ExcelJS from "exceljs";

// Material-UI
import { Button } from "@mui/material";


const ExcelDownloader = ({ data, fileName }) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      header: key,
      key: key,
      width: key === 'Etiquetas' ? 100 : 20, // Hacemos la columna de etiquetas mucho más ancha
    }));
  }, [data]);

  const downloadExcel = useCallback(async () => {
    if (data.length === 0) {
      console.error("No hay datos para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invitados");
    worksheet.columns = columns;

    // Modificamos cómo se añaden las filas para manejar el array de etiquetas
    data.forEach(row => {
      const newRow = { ...row };
      if (Array.isArray(row.Etiquetas)) {
        newRow.Etiquetas = row.Etiquetas.join(', '); // Convertimos el array a string
      }
      worksheet.addRow(newRow);
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // Ajustamos el texto para que no se ajuste dentro de la celda
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: false
        };
      });
      if (rowNumber === 1) {
        row.font = { bold: true };
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" },
        };
      }
    });

    // Ajustamos el ancho de las columnas basado en el contenido
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        let cellLength = cell.value ? cell.value.toString().length : 10;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      column.width = Math.min(maxLength + 2, 100); // Limitamos el ancho máximo a 100
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [data, columns, fileName]);

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={downloadExcel}
      disabled={data.length === 0}
    >
      Descargar Excel
    </Button>
  );
};

ExcelDownloader.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  fileName: PropTypes.string.isRequired,
};

export default ExcelDownloader;