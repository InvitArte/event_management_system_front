// React y hooks
import React, { useCallback, useMemo } from "react";

// Bibliotecas de terceros
import PropTypes from "prop-types";
import ExcelJS from "exceljs";

// Material-UI
import { Button } from "@mui/material";

const ExcelDownloader = ({ data, fileName, columnWidths = {} }) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      header: key,
      key: key,
      width: columnWidths[key] || 20,
    }));
  }, [data, columnWidths]);

  const downloadExcel = useCallback(async () => {
    if (data.length === 0) {
      console.error("No hay datos para exportar");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);
    worksheet.columns = columns;

    data.forEach(row => {
      const newRow = { ...row };
      Object.keys(newRow).forEach(key => {
        if (Array.isArray(newRow[key])) {
          newRow[key] = newRow[key].join(', ');
        }
      });
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

    worksheet.columns.forEach(column => {
      if (!columnWidths[column.key]) {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          let cellLength = cell.value ? cell.value.toString().length : 10;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = Math.min(maxLength + 2, 100);
      }
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
  }, [data, columns, fileName, columnWidths]);

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
  columnWidths: PropTypes.object,
};

export default ExcelDownloader;