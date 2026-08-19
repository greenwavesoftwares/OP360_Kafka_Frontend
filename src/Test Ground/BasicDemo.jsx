import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "./BasicDemo.css";

export default function BasicDemo() {
  const [products, setProducts] = useState([]);
  const [deletedRow, setDeletedRow] = useState(null);
  const [progress, setProgress] = useState(100); // Start from 100%
  const undoTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Demo data
  const demoData = [
    { code: "P001", name: "Product 1", category: "Category A", quantity: 10 },
    { code: "P002", name: "Product 2", category: "Category B", quantity: 20 },
    { code: "P003", name: "Product 3", category: "Category A", quantity: 15 },
    { code: "P004", name: "Product 4", category: "Category C", quantity: 5 },
  ];

  useEffect(() => {
    setProducts(demoData);
  }, []);

  // Function to delete a product and show undo button
  const deleteProduct = (productCode) => {
    const rowToDelete = products.find(
      (product) => product.code === productCode
    );
    setDeletedRow(rowToDelete);

    // Remove the product immediately
    setProducts(products.filter((product) => product.code !== productCode));

    // Reset progress and start timer
    setProgress(100);
    undoTimeoutRef.current = setTimeout(() => {
      setDeletedRow(null); // Clear the deleted row after timeout
      clearInterval(intervalRef.current); // Clear the progress interval
    }, 5000); // 5-second timeout

    // Start interval to update progress
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current); // Clear interval when it reaches 0
          return 0;
        }
        return prev - 100 / 50; // Decrement progress in 5 seconds
      });
    }, 100); // Update every 100 ms
  };

  // Undo function to restore the deleted row
  const undoDelete = () => {
    clearTimeout(undoTimeoutRef.current); // Cancel the timeout
    clearInterval(intervalRef.current); // Clear the progress interval
    setProducts((prev) => [...prev, deletedRow]); // Restore the deleted row
    setDeletedRow(null); // Clear the deleted row
  };

  // Template to render the delete button
  const deleteButtonTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-danger"
        onClick={() => deleteProduct(rowData.code)}
      />
    );
  };

  return (
    <div className="card">
      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
        <Column field="code" header="Code"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
        <Column body={deleteButtonTemplate} header="Actions"></Column>
      </DataTable>

      {deletedRow && (
        <div className="toast-container">
          <div className="toast">
            <div className="toast-content">
              <span>Item deleted</span>
              <Button
                label="Undo"
                className="p-button-text p-button-success undo-button"
                onClick={undoDelete}
              />
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
