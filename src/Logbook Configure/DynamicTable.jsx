import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DynamicTbale = () => {
  const data = [
    {
      id: "1000",
      code: "f230fh0g3",
      name: "Bamboo Watch",
      description: "Product Description",
      image: "bamboo-watch.jpg",
      price: 65,
      category: "Accessories",
      quantity: 24,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1001",
      code: "nvklal433",
      name: "Black Watch",
      description: "Product Description",
      image: "black-watch.jpg",
      price: 72,
      category: "Accessories",
      quantity: 61,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1002",
      code: "zz21cz3c1",
      name: "Blue Band",
      description: "Product Description",
      image: "blue-band.jpg",
      price: 79,
      category: "Fitness",
      quantity: 2,
      inventoryStatus: "LOWSTOCK",
      rating: 3,
    },
    {
      id: "1003",
      code: "244wgerg2",
      name: "Blue T-Shirt",
      description: "Product Description",
      image: "blue-t-shirt.jpg",
      price: 29,
      category: "Clothing",
      quantity: 25,
      inventoryStatus: "INSTOCK",
      rating: 5,
    },
    {
      id: "1004",
      code: "h456wer53",
      name: "Bracelet",
      description: "Product Description",
      image: "bracelet.jpg",
      price: 15,
      category: "Accessories",
      quantity: 73,
      inventoryStatus: "INSTOCK",
      rating: 4,
    },
    {
      id: "1005",
      code: "av2231fwg",
      name: "Brown Purse",
      description: "Product Description",
      image: "brown-purse.jpg",
      price: 120,
      category: "Accessories",
      quantity: 0,
      inventoryStatus: "OUTOFSTOCK",
      rating: 4,
    },
  ];

  const rowsPerPageOptions = [5, 10, data.length].filter(
    (option) => option <= data.length
  );

  const dynamicColumns = Object.keys(data[0]).map((col) => {
    if (col === "image") {
      return (
        <Column
          key={col}
          field={col}
          header={col.charAt(0).toUpperCase() + col.slice(1)}
          body={(rowData) => (
            <img
              src={rowData[col]}
              alt={rowData.name}
              style={{ width: "50px", height: "50px" }}
            />
          )}
        />
      );
    }
    return (
      <Column
        key={col}
        field={col}
        header={col.charAt(0).toUpperCase() + col.slice(1)}
      />
    );
  });

  return (
    <div className="card">
      <DataTable
        value={data}
        responsiveLayout="scroll"
        paginator
        rows={Math.min(5, data.length)} // Default rows per page
        rowsPerPageOptions={rowsPerPageOptions} // Adjusted dynamically
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      >
        {dynamicColumns}
      </DataTable>
    </div>
  );
};

export default DynamicTbale;
