import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import {
  customReportColumnMapping,
  getTransactionAttachmentFromCellIdAndTransactionId,
} from "../Logbook/LogbookApi";
import FileDownloadComponent from "../Logbook Configure/FileDownloadComponent";

export default function LogbookReportsTable({ reportName, allLogbookReports }) {
  const dt = useRef(null);
  const [blobData, setBlobData] = useState({});
  const [mappedData, setMappedData] = useState([]);
  const [columnMapping, setColumnMapping] = useState([]);

  function convertToColumnMapping(abcArray) {
    return abcArray.reduce((mapping, item) => {
      mapping[item.CellId] = item.ReportAliasId
        ? item.ReportAliasId
        : item.CellId;
      return mapping;
    }, {});
  }

  useEffect(() => {
    async function fetchAndMapData() {
      const customColumn = await customReportColumnMapping(reportName);
      const columnMapping = convertToColumnMapping(customColumn);

      setColumnMapping({
        Timestamp: "Timestamp",
        TransactionId: "TransactionId",
        ...columnMapping,
      });

      const transformedData = allLogbookReports.map((entry) => {
        const newEntry = {
          TransactionId: entry.TransactionId,
          Timestamp: entry.Timestamp,
        };

        Object.keys(entry).forEach((key) => {
          if (columnMapping[key]) {
            newEntry[columnMapping[key]] = entry[key];
          }
        });

        return newEntry;
      });

      setMappedData(transformedData);
    }

    fetchAndMapData();
  }, [allLogbookReports, reportName]);

  // Fetch blob data when component mounts
  useEffect(() => {
    const fetchAllBlobs = async () => {
      const blobDataMap = { ...blobData };
      for (const entry of mappedData) {
        const blobKey = Object.keys(entry).find(
          (key) => entry[key] === "Blob_File",
        );
        if (blobKey) {
          const { TransactionId: id } = entry;
          const cellId = Object.keys(columnMapping).find(
            (key) => columnMapping[key] === blobKey,
          );
          const data = await getTransactionAttachmentFromCellIdAndTransactionId(
            id,
            cellId,
          );

          if (!blobDataMap[id]) blobDataMap[id] = {};
          blobDataMap[id][blobKey] = data;
          setBlobData({ ...blobDataMap });
        }
      }
    };

    fetchAllBlobs();
  }, [mappedData]);

  // Utility function to format the date into a specific string format (YYYY-MM-DD HH:mm:ss.SSS)
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    // Returns the date in the desired format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // Export the data as CSV file (selectionOnly decides if we export only selected rows)
  const exportCSV = (selectionOnly) => {
    // dt.current.exportCSV({ selectionOnly }); // Uses DataTable's export function
    const fileName = `${reportName}_${getFormattedDate(new Date())}.csv`; // Create a unique filename
    dt.current.exportCSV({ selectionOnly, filename: fileName }); // Use DataTable's export function with custom filename
  };

  // Export the data as a PDF file using jsPDF and autoTable
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default(0, 0); // Create a new PDF document

        // Create columns for the table by using the keys from the first report object
        const cols = Object.keys(mappedData[0]).map((key) => ({
          field: key, // Field is the data key (e.g., report ID, date, etc.)
          header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter of the column name
        }));

        // Prepare column data for export in CSV/PDF formats
        const exportColumns = cols.map((col) => ({
          title: col.header, // Title for the exported file (same as column header)
          dataKey: col.field, // The field to be included in the exported data
        }));

        doc.autoTable(exportColumns, mappedData); // Add table data to the PDF
        doc.save(`${reportName}_${getFormattedDate(new Date())}.pdf`); // Save the PDF with the name "logbookReports.pdf"
      });
    });
  };

  // Export the data as an Excel file using xlsx library
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(mappedData); // Convert the logbook reports to a sheet format
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] }; // Create a workbook with a sheet
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, reportName); // Save the file
    });
  };

  // Helper function to save the Excel file to the user's device
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"; // MIME type for Excel files
        const data = new Blob([buffer], { type: EXCEL_TYPE }); // Create a Blob object from the buffer

        module.default.saveAs(
          data,
          `${reportName}_${getFormattedDate(new Date())}.xlsx`,
        );
      }
    });
  };

  // Header that contains export buttons for CSV, Excel, and PDF
  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      <Button
        type="button"
        icon="pi pi-file" // Icon for CSV
        rounded
        onClick={() => exportCSV(false)} // Exports all rows as CSV
        data-pr-tooltip="CSV" // Tooltip text for CSV button
        tooltip="CSV" // Tooltip hint
      />
      <Button
        type="button"
        icon="pi pi-file-excel" // Icon for Excel
        severity="success"
        rounded
        onClick={exportExcel} // Export data to Excel format
        data-pr-tooltip="XLS" // Tooltip text for Excel button
        tooltip="XLS" // Tooltip hint
      />
      <Button
        type="button"
        icon="pi pi-file-pdf" // Icon for PDF
        severity="warning"
        rounded
        onClick={exportPdf} // Export data to PDF format
        data-pr-tooltip="PDF" // Tooltip text for PDF button
        tooltip="PDF" // Tooltip hint
      />
    </div>
  );

  // Function to format cell data
  const bodyTemplate = (rowData, column) => {
    if (rowData[column.field] === "Blob_File") {
      // return blobData[rowData.TransactionId]?.[column.field].fileName;
      const elem = blobData[rowData.TransactionId]?.[column.field];

      return (
        <FileDownloadComponent
          byteArray={elem?.fileContent}
          fileNamePath={elem?.fileName}
        />
      );
    }

    return rowData[column.field] || "-";
  };

  return (
    <div className="card">
      <Tooltip target=".export-buttons>button" position="bottom" />
      <DataTable
        ref={dt}
        value={mappedData}
        showGridlines
        tableStyle={{ fontSize: "0.8rem" }}
        className="UserInfoTableStyle HeaderStyle HeaderColor"
        header={header} // Header with export buttons
      >
        {Object.keys(columnMapping).map((key, index) => (
          <Column
            key={index}
            field={columnMapping[key]}
            header={columnMapping[key]}
            sortable
            filterField={columnMapping[key]}
            filter
            body={(rowData) =>
              bodyTemplate(rowData, { field: columnMapping[key] })
            }
          />
        ))}
      </DataTable>
    </div>
  );
}
