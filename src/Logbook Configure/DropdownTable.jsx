import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const DropdownTable = ({ items, setItems }) => {
  useEffect(() => {
    const updatedItems = items.map((data, index) => {
      return { ...data, id: index + 1 };
    });

    setItems(updatedItems);
  }, []);
  // Add a new row with default values
  console.log("My Items in dropdown ", items);
  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, itemLabel: "New Label", itemValue: "New Value" },
    ]);
  };

  // Delete a row by filtering out the item with the given id
  const deleteItem = (rowData) => {
    setItems(items.filter((item) => item.id !== rowData.id));
  };

  // Cell edit complete handler
  const onCellEditComplete = (e) => {
    const { rowData, newValue, field } = e;

    if (newValue.trim().length > 0) {
      const updatedItems = items.map((item) =>
        item.id === rowData.id ? { ...item, [field]: newValue } : item
      );
      setItems(updatedItems);
    } else {
      e.originalEvent.preventDefault(); // Prevent invalid empty values
    }
  };

  // Cell editor for text input (ItemLabel and ItemValue)
  const textEditor = (option) => {
    return (
      <InputText
        type="text"
        value={option.value}
        onChange={(e) => option.editorCallback(e.target.value)}
        autoFocus
        onFocus={(e) => {
          e.target.select(); // No need to store in a variable if not used

          const updatedItems = items.map((data, index) => ({
            ...data,
            id: index + 1,
          }));

          setItems(updatedItems);
        }}
        // Automatically selects the existing text
      />
    );
  };
  return (
    <div  style={{marginBottom:"0.5rem"}}>
      <DataTable
        header={
          <Button
            label="Add Item"
            icon="pi pi-plus"
            size="small"
            onClick={addItem}
            style={{ width: "135px" }}
          />
        }
        value={items}
        editMode="cell"
        emptyMessage="No items found."
        className="primereactDatatableStyle"

      >
        <Column
          field="itemLabel"
          header="Item Label"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          field="itemValue"
          header="Item Value"
          editor={(options) => textEditor(options)}
          onCellEditComplete={onCellEditComplete}
        />
        <Column
          header="Delete"
          body={(rowData) => (
            <Button
              icon="pi pi-trash"
              outlined
              text
              raised
              rounded
              className="p-button-danger"
              onClick={() => deleteItem(rowData)}
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default DropdownTable;
