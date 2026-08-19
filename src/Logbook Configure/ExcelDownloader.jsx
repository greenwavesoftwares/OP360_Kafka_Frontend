import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "primereact/button";

const ExcelDownloader = ({ data, selectedSheet }) => {
  console.log("Excel Sheet : ", selectedSheet);

  // const handleDownload = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Sheet1");

  //   const mergedCells = [];

  //   data.forEach((row) => {
  //     row.cellInfo.forEach((cell) => {
  //       const rowIndex = cell.rowNum;
  //       const colIndex = cell.colNum;

  //       // Set cell value
  //       const excelCell = worksheet.getCell(rowIndex, colIndex);
  //       excelCell.value = cell.aliasId || "";

  //       // Apply background color for editable cells
  //       if (cell.editable) {
  //         excelCell.fill = {
  //           type: "pattern",
  //           pattern: "solid",
  //           fgColor: { argb: "FFFF00" }, // Yellow background
  //         };
  //       }

  //       // Merge cells if necessary
  //       if (cell.colSpan > 1 || cell.rowSpan > 1) {
  //         mergedCells.push({
  //           sRow: rowIndex,
  //           eRow: rowIndex + (cell.rowSpan || 1) - 1,
  //           sCol: colIndex,
  //           eCol: colIndex + (cell.colSpan || 1) - 1,
  //         });
  //       }
  //     });
  //   });

  //   // Apply merged cells
  //   mergedCells.forEach(({ sRow, eRow, sCol, eCol }) => {
  //     worksheet.mergeCells(sRow, sCol, eRow, eCol);
  //   });

  //   // Generate and download the file
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   saveAs(
  //     new Blob([buffer], { type: "application/octet-stream" }),
  //     `${selectedSheet}.xlsx`
  //   );
  // };
  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const mergedCells = new Set(); // use a Set to track unique merge ranges

    data.forEach((row) => {
      row.cellInfo.forEach((cell) => {
        const rowIndex = cell.rowNum;
        const colIndex = cell.colNum;

        const excelCell = worksheet.getCell(rowIndex, colIndex);
        excelCell.value = cell.aliasId || "";

        if (cell.editable) {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" },
          };
        }

        // Merge cells only if necessary
        if (cell.colSpan > 1 || cell.rowSpan > 1) {
          const sRow = rowIndex;
          const eRow = rowIndex + (cell.rowSpan || 1) - 1;
          const sCol = colIndex;
          const eCol = colIndex + (cell.colSpan || 1) - 1;

          const key = `${sRow}:${sCol}:${eRow}:${eCol}`;

          if (!mergedCells.has(key)) {
            mergedCells.add(key);
            try {
              worksheet.mergeCells(sRow, sCol, eRow, eCol);
            } catch (e) {
              console.error(`Error merging cells ${key}:`, e);
            }
          }
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${selectedSheet}.xlsx`
    );
  };

  return (
    <Button
      size="small"
      icon="pi pi-file-excel"
      rounded
      className="p-button-raised p-button-secondary"
      style={{ background: "#185C37",width: "1rem",height: "2rem",boxShadow:"none",border:"none" }}
      onClick={handleDownload}
    />
  );
};

export default ExcelDownloader;
