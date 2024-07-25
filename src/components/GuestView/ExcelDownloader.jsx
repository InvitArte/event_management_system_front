import React, { useCallback, useMemo } from "react";
import { Button } from "@mui/material";
import ExcelJS from "exceljs";

const ExcelDownloader = ({ data, fileName }) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      header: key,
      key: key,
      width: 20,
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
    worksheet.addRows(data);

    // Estilo para las celdas
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
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

    // Generar el archivo Excel
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

export default ExcelDownloader;
