import { Grid, Paper, Box, Badge } from "@mui/material";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import FormDesign from "./FormDesign";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "primereact/button";
import { Button as MuiButton } from "@mui/material";
import { InputSwitch } from "primereact/inputswitch";
import DateField from "../components/shared/DateField/DateField.component";
import { Checkbox } from "primereact/checkbox";
import NumberBox from "../components/shared/NumberBox/NumberBox.component";
import CommentBox from "../components/shared/CommentBox/CommentBox.component";
import InputTextBox from "../components/shared/TextBox/InputTextBox.component";
import Image from "../components/shared/Image/Image.component";
import DateTimeField from "../components/shared/DateField/DateTimeField.component";
import TimeField from "../components/shared/DateField/TimeField.component";
import Dropdown from "../components/shared/Dropdown/Dropdown.component";
import FileDownloadComponent from "./FileDownloadComponent";
import { getCurrentUser } from "../UserModuleUpdated/helper";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
const parseCssString = (cssString) => {
  return cssString
    ? cssString.split(";").reduce((acc, rule) => {
        const [property, value] = rule.split(":");
        if (property && value) {
          acc[property.trim()] = value.trim();
        }
        return acc;
      }, {})
    : {};
};

const FormGrid = ({ sheetDetails, setSheetDetails, tableForm }) => {
  const [checked, setChecked] = useState(false);
  const [aliasIds, setAliasIds] = useState("");
  const [visible, setVisible] = useState(false);
  const [clickedCell, setClickedCell] = useState(null);
  const [toggledCell, setToggledCell] = useState(null);
  const [clickedCellForIcon, setClickedCellForIcon] = useState(null);
  const [copyMode, setCopyMode] = useState(false);
  const [withToggle, setWithToggle] = useState(false);
  const [copiedCell, setCopiedCell] = useState(null);
  const [pastedCells, setPastedCells] = useState(new Set());
  const [clickedCells, setClickedCells] = useState(new Set()); // Track clicked cells

  const [switchStates, setSwitchStates] = useState({});
  const [showCheckbox, setShowCheckbox] = useState(false); // Controls Checkbox visibility
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [gridProperties, setGridPropertes] = useState({
    maxColNum: 0,
    occupiedGrid: [],
  });
  const [resultArray, setResultArray] = useState([]);
  const loggedInUser = getCurrentUser();
  useEffect(() => {
    // setSelectedCells(new Set());

    // debugger;
    console.log("toggled cell in UseEffect : ", toggledCell);
    const filteredArray = new Set();
    console.log("selected cells in useEffect  : ", selectedCells);
    setResultArray([]);

    // Iterate through the JSON array to filter cells
    if (toggledCell === null && clickedCell !== null) {
      selectedCells.clear();
      sheetDetails.forEach((form) => {
        form.cellInfo.forEach((sheetCell) => {
          if (
            sheetCell.dependentFields &&
            sheetCell.dependentFields.some(
              (depField) => depField.cellId === clickedCell.cellId
            )
          ) {
            console.log("sheetCell for : ", sheetCell);
            selectedCells.add(sheetCell.cellId); // Directly add the dependent field's cellId to the set
          }
        });
      });

      console.log("Selected Cell on toggle : ", selectedCells);

      // Update the state with the updated selectedCells set
      setSelectedCells(new Set(selectedCells));
    }
    if (toggledCell && clickedCell === null) {
      // sheetDetails.forEach((form) => {
      //   form.cellInfo.forEach((cell) => {
      //     // Loop through each selected cell and match the cellId
      //     selectedCells.forEach((selectedCellId) => {
      //       // Check if the cellId matches any of the selected cells
      //       if (cell.cellId === selectedCellId) {
      //         filteredArray.push(cell);
      //       }
      //     });
      //   });
      // });

      // // Update the state with the filtered array
      // console.log("filter array : ", filteredArray);

      // const updatedSelectedCells = new Set(selectedCells); // Make a copy of selectedCells
      // console.log("resultArray in function : ", filteredArray);
      // if (filteredArray && Array.isArray(filteredArray)) {
      //   filteredArray.forEach((field) => {
      //     if (field.cellId) {
      //       updatedSelectedCells.add(field.cellId); // Add dependent field's cellId to the set
      //     }
      //   });
      // }
      // console.log("New Selected IDs : ", updatedSelectedCells);
      // setSelectedCells(updatedSelectedCells);

      // setResultArray(filteredArray);
      sheetDetails.forEach((form) => {
        form.cellInfo.forEach((sheetCell) => {
          if (
            sheetCell.dependentFields &&
            sheetCell.dependentFields.some(
              (depField) => depField.cellId === toggledCell.cellId
            )
          ) {
            console.log("sheetCell : ", sheetCell);
            selectedCells.add(sheetCell.cellId); // Directly add the dependent field's cellId to the set
          }
        });
      });

      console.log("Selected Cell on toggle : ", selectedCells);

      // Update the state with the updated selectedCells set
      setSelectedCells(new Set(selectedCells));

      sheetDetails.forEach((form) => {
        form.cellInfo.forEach((cell) => {
          // Loop through each selected cell and match the cellId
          selectedCells.forEach((selectedCellId) => {
            // Check if the cellId matches any of the selected cells
            if (cell.cellId === selectedCellId) {
              filteredArray.add(cell);
            }
          });
        });
      });

      setResultArray(Array.from(filteredArray));
      // setWithToggle(false);
    }

    if (clickedCell) {
      console.log("My WithToggle in clicked : ", withToggle);
      // setSelectedCells(new Set());
      // sheetDetails.forEach((form) => {
      //   form.cellInfo.forEach((cell) => {
      //     // Loop through each selected cell and match the cellId
      //     selectedCells.forEach((selectedCellId) => {
      //       // Check if the cellId matches any of the selected cells
      //       if (cell.cellId === selectedCellId) {
      //         filteredArray.push(cell);
      //       }
      //     });
      //   });
      // });

      // Update the state with the filtered array
      // console.log("filter array for clicked Cell : ", filteredArray);

      // const updatedSelectedCells = new Set(selectedCells); // Make a copy of selectedCells
      // console.log("resultArray in function : ", filteredArray);

      // if (filteredArray && Array.isArray(filteredArray)) {
      //   filteredArray.forEach((field) => {
      //     if (field.cellId) {
      //       updatedSelectedCells.add(field.cellId); // Add dependent field's cellId to the set
      //     }
      //   });
      // }
      // setSelectedCells(updatedSelectedCells);
      console.log("selectedCells.length : ", Array.from(selectedCells).length);
      if (withToggle === false) {
        // if (Array.from(selectedCells).length === 0) {
        // console.log("I am True");
        // sheetDetails.forEach((form) => {
        //   form.cellInfo.forEach((sheetCell) => {
        //     if (
        //       sheetCell.dependentFields &&
        //       sheetCell.dependentFields.some(
        //         (depField) => depField.cellId === clickedCell.cellId
        //       )
        //     ) {
        //       console.log("sheetCell : ", sheetCell);
        //       selectedCells.add(sheetCell.cellId); // Directly add the dependent field's cellId to the set
        //     }
        //   });
        // });

        console.log("Selected Cell on Clicked : ", selectedCells);

        // Update the state with the updated selectedCells set
        // setSelectedCells(new Set(selectedCells));
        // }

        sheetDetails.forEach((form) => {
          form.cellInfo.forEach((cell) => {
            // Loop through each selected cell and match the cellId
            selectedCells.forEach((selectedCellId) => {
              // Check if the cellId matches any of the selected cells
              if (cell.cellId === selectedCellId) {
                filteredArray.add(cell);
              }
            });
          });
        });
        console.log("filteredArray for withtoggle true : ", filteredArray);
        setResultArray(Array.from(filteredArray));
      }

      if (withToggle === true) {
        // sheetDetails.forEach((form) => {
        //   form.cellInfo.forEach((sheetCell) => {
        //     if (
        //       sheetCell.dependentFields &&
        //       sheetCell.dependentFields.some(
        //         (depField) => depField.cellId === clickedCell.cellId
        //       )
        //     ) {
        //       console.log("sheetCell : ", sheetCell);
        //       filteredArray.push(sheetCell); // Directly add the dependent field's cellId to the set
        //     }
        //   });
        // });
        // console.log("My Filter in Clicked ", filteredArray);

        // setResultArray(filteredArray);
        sheetDetails.forEach((form) => {
          form.cellInfo.forEach((cell) => {
            // Loop through each selected cell and match the cellId
            selectedCells.forEach((selectedCellId) => {
              // Check if the cellId matches any of the selected cells
              if (cell.cellId === selectedCellId) {
                filteredArray.add(cell);
              }
            });
          });
        });
        console.log("filteredArray for withtoggle true : ", filteredArray);
        setResultArray(Array.from(filteredArray));
      }
    }
  }, [toggledCell, clickedCell]);

  useEffect(() => {
    //_______________________________________________________________________________________________________

    // const maxColNum = Math.max(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => getColNumFromCellId(cell.cellId))
    //   )
    // );
    // console.log("maxColNum", maxColNum);
    // const maxRowNum = Math.max(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => getRowNumFromCellId(cell.cellId))
    //   )
    // );
    // console.log("maxRowNum", maxRowNum);
    // const minRowNum = Math.min(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => getRowNumFromCellId(cell.cellId))
    //   )
    // );
    // console.log("minRowNum", minRowNum);
    // const minColNum = Math.min(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => getColNumFromCellId(cell.cellId))
    //   )
    // );
    // console.log("minColNum", minColNum);
    // const occupiedGrid = Array.from({ length: maxRowNum }, () =>
    //   Array(maxColNum).fill(false)
    // );

    //_________________________________________________________________________________________________________

    function getRowNumFromCellId(inputString) {
      const parts = inputString.split("_"); // Split the string by "_"
      console.error("Number(parts[1]) ::: ", Number(parts[1]));
      return Number(parts[1]); // Convert the second part to a number and return
    }

    function getColNumFromCellId(inputString) {
      const parts = inputString.split("_"); // Split the string by "_"
      console.error("Number(parts[2]) ::: ", Number(parts[2]));
      return Number(parts[2]); // Convert the second part to a number and return
    }

    // const qwerty = sheetDetails.flatMap((form) =>
    //   form.cellInfo.map((cell) => cell.cellId)
    // );
    // // Log the result
    // console.error("qwerty ::: ", qwerty);

    // const parsedCells = qwerty.map((cell) => {
    //   const [_, row, col] = cell.split("_").map(Number); // Extract row and column as numbers
    //   console.log("{ row, col } ::: ", { row, col });
    //   return { row, col };
    // });
    // console.log("parsedCells ::: ", parsedCells);
    // // Calculate the first row number and the minimum column number
    // const firstRow = parsedCells[0].row; // Row number of the first element
    // console.log("firstRow ::: ", firstRow);
    // const firstCol = Math.min(...parsedCells.map((cell) => cell.col)); // Minimum column value
    // console.log("firstCol ::: ", firstCol);
    // // Transform the cell array based on new logic
    // const transformedArray = parsedCells.map((cell) => {
    //   const newRow = cell.row + 1 - firstRow; // Subtract first row number
    //   const newCol = cell.col + 1 - firstCol; // Subtract minimum column value
    //   console.log("cell.row ::: ", cell.row, " ::: newRow ::: ", newRow);
    //   console.log("cell.col ::: ", cell.col, " ::: newCol ::: ", newCol);
    //   console.log("---------------------------------------");
    //   return `_${newRow}_${newCol}`; // Rebuild the cellId
    // });
    // Log the transformed array
    // console.error("transformedArray :: ", transformedArray);

    // let tempSheetDetails = sheetDetails;

    // let transformedIndex = 0; // To track the transformed cellIds
    // tempSheetDetails.forEach((form) => {
    //   form.cellInfo.forEach((cell) => {
    //     cell.rowNum = getRowNumFromCellId(transformedArray[transformedIndex]);
    //     cell.colNum = getColNumFromCellId(transformedArray[transformedIndex]);
    //     cell.cellId = transformedArray[transformedIndex];
    //     transformedIndex++;
    //   });
    // });
    // Step 3: Log the updated formData
    // console.log(
    //   "tempSheetDetails ::: ",
    //   tempSheetDetails.forEach((form) => {
    //     form.cellInfo.forEach((cell) => {
    //       console.log("cell ::: ", cell);
    //     });
    //   })
    // );
    // console.log(
    //   "Updated tempSheetDetails :: ",
    //   JSON.stringify(tempSheetDetails, null, 2)
    // );

    // const maxColNum = Math.max(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => cell.colNum)
    //   )
    // );
    const allCells = sheetDetails.flatMap((item) =>
      Array.isArray(item.cellInfo) ? item.cellInfo : []
    );

    // Compute max col considering colSpan
    const maxColNum = Math.max(
      ...allCells.map((cell) => {
        const colNum = parseInt(cell.colNum, 10) || 0;
        const colSpan = parseInt(cell.colSpan, 10) || 1;
        return colNum + colSpan - 1;
      })
    );

    console.log("maxColNum", maxColNum);
    // const maxRowNum = Math.max(
    //   ...sheetDetails.flatMap((item) =>
    //     item.cellInfo.map((cell) => cell.rowNum)
    //   )
    // );
    const maxRowNum = Math.max(
      ...allCells.map((cell) => {
        const rowNum = parseInt(cell.rowNum, 10) || 0;
        const rowSpan = parseInt(cell.rowSpan, 10) || 1;
        return rowNum + rowSpan - 1;
      })
    );

    // console.log("maxRowNum:", maxRowNum);

    console.log("maxRowNum", maxRowNum);
    const minRowNum = Math.min(
      ...sheetDetails.flatMap((item) =>
        item.cellInfo.map((cell) => cell.rowNum)
      )
    );
    console.log("minRowNum", minRowNum);
    const minColNum = Math.min(
      ...sheetDetails.flatMap((item) =>
        item.cellInfo.map((cell) => cell.colNum)
      )
    );
    console.log("minColNum", minColNum);
    const occupiedGrid = Array.from({ length: maxRowNum }, () =>
      Array(maxColNum).fill(false)
    );

    sheetDetails.forEach((form) => {
      form.cellInfo.forEach((cell) => {
        // Mark cells as occupied based on their rowNum and colNum
        for (let i = 0; i < cell.rowSpan; i++) {
          for (let j = 0; j < cell.colSpan; j++) {
            const rowIndex = cell.rowNum - 1 + i;
            const colIndex = cell.colNum - 1 + j;

            // console.error("cell.rowNum ::: ", cell.rowNum);
            // console.error("cell.colNum ::: ", cell.colNum);
            // console.log("rowIndex ::: ", rowIndex);
            // console.log("colIndex ::: ", colIndex);

            // Check if the indices are within bounds
            if (rowIndex < maxRowNum && colIndex < maxColNum) {
              // console.log("row and col : ", rowIndex, colIndex, cell.aliasId);
              occupiedGrid[rowIndex][colIndex] = true;
              // console.log("row and col : ", rowIndex, colIndex);
            }
          }
        }
      });
    });

    setGridPropertes({
      ...gridProperties,
      occupiedGrid: occupiedGrid,
      maxColNum: maxColNum,
    });
  }, [sheetDetails]);

  const handleCheckboxChange = (e, cell) => {
    console.log("Checked Cell : ", cell);
    const updatedSelectedCells = new Set(selectedCells);

    if (e.checked) {
      updatedSelectedCells.add(cell.cellId); // Add to selected if checked
    } else {
      updatedSelectedCells.delete(cell.cellId); // Remove from selected if unchecked
    }

    console.log("selected Note : ", updatedSelectedCells);
    setSelectedCells(updatedSelectedCells);
    handleSwitchOff(updatedSelectedCells);
  };

  // Function to handle when the switch is toggled off
  const handleSwitchOff = (selectedCells) => {
    if (checkIfAnySwitchIsOn(switchStates)) {
      console.log("States : ", switchStates);

      console.log("Selected Cells Main : ", Array.from(selectedCells).length);
      console.log("Selected Cells Main Not Length : ", selectedCells);

      // if (Array.from(selectedCells).length === 0) {
      //   return;
      // }

      // const selectedCellObjects = Array.from(selectedCells)
      //   .map((cellId) => {
      //     const cell = sheetDetails
      //       .flatMap((form) => form.cellInfo)
      //       .find((cell) => cell.cellId === cellId);

      //     // Add dependent: true if the cell exists and matches the condition
      //     if (cell) {
      //       return {
      //         ...cell,
      //         dependent: true,
      //       };
      //     }
      //     return null; // Handle cases where the cell is not found
      //   })
      //   .filter(Boolean); // Remove any null values from the resulting array

      // const selectedCell = '_3_2'; // Single cellId string

      // const selectedCellObjects = (() => {
      //   const cell = sheetDetails
      //     .flatMap((form) => form.cellInfo)
      //     .find((cell) => cell.cellId === switchStates.toggledCellId);

      //   // If the cell exists, return the modified cell object
      //   if (cell) {
      //     return [{ ...cell, dependent: true }];
      //   }
      //   return []; // Return an empty array if no cell is found
      // })();

      // console.log("to be dependent Cell : ", selectedCellObjects);

      // // const depCellId = "_2_2"; // The cell ID to match for dependent: true

      // const updatedSheetDetailsWithDependentFields = sheetDetails.map(
      //   (form) => {
      //     return {
      //       ...form,
      //       cellInfo: form.cellInfo.map((cell) => {
      //         const isCellSelected = [...selectedCells].some((value) => {
      //           return cell.cellId?.trim() === value?.trim();
      //         });

      //         // Update dependentFields if the cell is selected
      //         if (isCellSelected) {
      //           console.log("Updating cell with dependentFields:", cell.cellId);

      //           cell = {
      //             ...cell,
      //             dependentFields: [
      //               ...(cell.dependentFields || []), // Preserve existing data
      //               ...selectedCellObjects, // Add new data
      //             ].filter(
      //               (item, index, array) =>
      //                 array.findIndex(
      //                   (element) => element.cellId === item.cellId
      //                 ) === index // Ensure uniqueness by cellId
      //             ),
      //           };
      //         }

      //         // Remove selectedCellObjects if the cell is not selected
      //         if (!isCellSelected) {
      //           console.log(
      //             "Removing selectedCellObjects from dependentFields:",
      //             cell.cellId
      //           );

      //           cell = {
      //             ...cell,
      //             dependentFields: (cell.dependentFields || []).filter(
      //               (item) =>
      //                 !selectedCellObjects.some(
      //                   (selected) => selected.cellId === item.cellId
      //                 )
      //             ), // Remove selectedCellObjects if not selected
      //           };
      //         }

      //         console.log("I am Here");
      //         // Update dependent if the cell matches the toggledCellId
      //         if (cell.cellId?.trim() === switchStates.toggledCellId.trim()) {
      //           console.log("Updating cell with dependent: true:", cell.cellId);
      //           cell = {
      //             ...cell,
      //             dependent: true, // Add dependent: true for matching depCellId
      //           };
      //         }

      //         return cell; // Return the updated or original cell
      //       }),
      //     };
      //   }
      // );

      // console.log(
      //   "updatedSheetDetailsWithDependentFields ",
      //   updatedSheetDetailsWithDependentFields
      // );

      // setSheetDetails(updatedSheetDetailsWithDependentFields);
      // setSelectedCells(new Set());
    }
  };

  // Function to check if any switch is ON
  const checkIfAnySwitchIsOn = (updatedSwitchStates) => {
    return Object.values(updatedSwitchStates).includes(true);
  };

  const handleCopyCell = (cell) => {
    setCopiedCell(cell);
    setCopyMode(true);
    console.log("Copied Cell:", cell);
  };

  const fieldWiseUpdates = (updatedCell, copiedCell) => {
    switch (copiedCell.fieldType) {
      case "Number":
        updatedCell = {
          ...updatedCell,
          minVal: copiedCell.minVal, // Update minVal from copiedCell
          maxVal: copiedCell.maxVal, // Update maxVal from copiedCell
          decimalPoints: copiedCell.decimalPoints, // Update decimalPoints from copiedCell
        };
        break;

      case "Date":
      case "DateTime":
        // Use OR (||) to handle both 'Date' and 'DateTime' cases
        if (
          copiedCell.fieldType === "Date" ||
          copiedCell.fieldType === "DateTime"
        ) {
          updatedCell = {
            ...updatedCell,
            datepattern: copiedCell.datepattern, // Update datepattern from copiedCell
          };
        }
        break;

      case "Image":
        updatedCell = {
          ...updatedCell,
          imgHeight: copiedCell.imgHeight, // Update imgHeight from copiedCell
          imgWidth: copiedCell.imgWidth, // Update imgWidth from copiedCell
          // imagePreview: copiedCell.imagePreview, // Update imagePreview from copiedCell
          fileContent: copiedCell.fileContent,
        };
        break;

      case "File":
        updatedCell = {
          ...updatedCell,
          fileContent: copiedCell.fileContent, // Update fileContent from copiedCell
        };
        break;

      case "Button":
        updatedCell = {
          ...updatedCell,
          selectedIcon: copiedCell.selectedIcon, // Update selectedIcon from copiedCell
          buttonKeyValue: copiedCell.buttonKeyValue, // Update buttonKey from copiedCell
        };
        break;

      case "URL":
        updatedCell = {
          ...updatedCell,
          url: copiedCell.url, // Update url from copiedCell
        };
        break;

      case "Dropdown":
        updatedCell = {
          ...updatedCell,
          dropDownFields: copiedCell.dropDownFields, // Update dropDownFields from copiedCell
          depExpressionLogic: copiedCell.depExpressionLogic,
        };
        break;

      case "API":
        updatedCell = {
          ...updatedCell,
          apiMethod: copiedCell.apiMethod, // Update dropDownFields from copiedCell
          apiBody: copiedCell.apiBody,
          apiUrl: copiedCell.apiUrl,
        };
        break;

      default:
        // Handle other field types or leave as is
        break;
    }

    return updatedCell; // Return the updated cell after modification
  };
  const handlePasteCell = (cell) => {
    console.log("copied cell: ", copiedCell, " css: ", copiedCell?.cellCSS);

    if (copyMode && copiedCell) {
      let updatedCell = {
        ...cell,
        cellCSS: copiedCell.cellCSS,
        editable: copiedCell.editable,
        requiredfield: copiedCell.requiredfield,
        fieldType: copiedCell.fieldType,
      };

      updatedCell = fieldWiseUpdates(updatedCell, copiedCell);

      const updatedData = sheetDetails.map((form) => ({
        ...form,
        cellInfo: form.cellInfo.map((c) =>
          c.cellId === cell.cellId ? updatedCell : c
        ),
      }));

      setSheetDetails(updatedData);

      // Update pasted cells immutably
      setPastedCells((prev) => new Set([...prev, cell.cellId]));

      console.log("Updated Cell:", updatedCell);
      console.log("Pasted to Cell:", cell);
    }
  };

  const handleCancelCopyMode = () => {
    setCopyMode(false);
    setCopiedCell(null);
    setPastedCells(new Set());
  };

  useEffect(() => {
    if (clickedCell) {
      console.log("clicked Cell In UseEffect : ", clickedCell);

      console.log("My OnHide Toggle : ", visible);

      const updatedData = sheetDetails.map((form) => ({
        ...form,
        cellInfo: form.cellInfo.map((cell) =>
          cell.cellId === clickedCell.cellId ? clickedCell : cell
        ),
      }));

      console.log("My Switches : ", switchStates);
      console.log("My Selected cell s : ", selectedCells);
      console.log("Updated Data : ", updatedData);
      let updatedSheetDetailsWithDependentFields = updatedData;

      if (!visible) {
        const selectedCellObjects = (() => {
          const cell = updatedData
            .flatMap((form) => form.cellInfo)
            .find((cell) => cell.cellId === clickedCell.cellId);

          if (cell) {
            return [{ ...cell, dependent: true }];
          }
          return [];
        })();
        console.log("to be dependent Cell : ", selectedCellObjects);

        console.log("My Slected Cell for Test : ", selectedCells);
        // if (selectedCells && selectedCells.size > 0) {

        // const selectedCellObjects = (() => {
        //   // Convert the set to an array and map each selected cell ID to the desired structure
        //   return Array.from(selectedCells).flatMap((selectedCellId) => {
        //     const cell = sheetDetails
        //       .flatMap((form) => form.cellInfo)
        //       .find((cell) => cell.cellId === selectedCellId);

        //     if (cell) {
        //       return [{ ...cell, dependent: true }];
        //     }
        //     return [];
        //   });
        // })();

        updatedSheetDetailsWithDependentFields = updatedData.map((form) => ({
          ...form,
          cellInfo: form.cellInfo.map((cell) => {
            const isCellSelected = selectedCells.has(cell.cellId?.trim());
            // const isCellSelected =
            //   cell.cellId?.trim() === clickedCell?.cellId?.trim();
            // Update dependentFields if the cell is selected
            if (isCellSelected) {
              console.log("Updating cell with dependentFields:", cell.cellId);
              console.log("Hii selected Cells : ", selectedCells);
              if (Array.from(selectedCells).length === 0) {
                console.log("I am Not Done");
              }
              return {
                ...cell,
                dependentFields: [
                  ...(cell.dependentFields || []),
                  ...selectedCellObjects,
                ].filter(
                  (item, index, array) =>
                    array.findIndex(
                      (element) => element.cellId === item.cellId
                    ) === index
                ),
              };
            }

            // Remove selectedCellObjects if the cell is not selected
            if (!isCellSelected) {
              console.log(
                "Removing selectedCellObjects from dependentFields:",
                cell.cellId
              );

              return {
                ...cell,
                dependentFields: (cell.dependentFields || []).filter(
                  (item) =>
                    !selectedCellObjects.some(
                      (selected) => selected.cellId === item.cellId
                    )
                ),
              };
            }

            // Update dependent if the cell matches the toggledCellId
            console.log(
              "Checking condition for:",
              cell.cellId,
              clickedCell?.cellId
            );
            if (cell.cellId?.trim() === clickedCell?.cellId.trim()) {
              console.log("Updating cell with dependent: true:", cell.cellId);
              return {
                ...cell,
                dependent: true,
              };
            }

            return cell;
          }),
        }));
        console.log(
          "updatedSheetDetailsWithDependentFields : ",
          updatedSheetDetailsWithDependentFields
        );

        // setSheetDetails(updatedSheetDetailsWithDependentFields);
        // setSelectedCells(new Set());
        // } else {

        // updatedSheetDetailsWithDependentFields = updatedData.map((item) => ({
        //   ...item,
        //   cellInfo: item.cellInfo.map((cell) => {
        //     if (cell.cellId === clickedCell.cellId) {
        //       // console.log("text value : ", e.target.value);
        //       console.log("boolean Cell ", {
        //         ...cell,
        //         // tickVal: e.target.checked,
        //         // value: e.target.checked,
        //         dependentFields: [],
        //       });
        //       return {
        //         ...cell,
        //         dependentFields: [],
        //       };
        //     }
        //     return cell;
        //   }),
        // }));
        // }
      }
      if (
        JSON.stringify(updatedSheetDetailsWithDependentFields) !==
        JSON.stringify(sheetDetails)
      ) {
        setSheetDetails(updatedSheetDetailsWithDependentFields);
        setClickedCell(null);
        // setSelectedCells(new Set());
      }
      // setSheetDetails(updatedData);
    }
    if (clickedCellForIcon) {
      setClickedCells((prev) => new Set(prev).add(clickedCellForIcon.cellId));
    }
  }, [clickedCell, sheetDetails, setSheetDetails, clickedCellForIcon]);

  return (
    <>
      {copyMode && (
        <Button
          label="Cancel Copy Mode"
          icon="pi pi-times"
          onClick={handleCancelCopyMode}
          style={{
            marginTop: "20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        />
      )}
      <div>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridProperties?.maxColNum}, 1fr)`,
            gap: 0.2,
            padding: "1px",
          }}
        >
          {sheetDetails.map((form, formIndex) =>
            form.cellInfo.map((cell, cellIndex) => {
              const parsedStyles = parseCssString(cell.cellCSS);

              const isPasted = pastedCells.has(cell.cellId);
              const isClicked = clickedCells.has(cell.cellId);

              return (
                <Paper
                  key={`${formIndex}-${cellIndex}`}
                  elevation={3}
                  sx={{
                    gridColumn: `span ${cell.colSpan}`,
                    gridRow: `span ${cell.rowSpan}`,
                    padding: "0.5rem",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    ...parsedStyles,
                    // ...(isPasted ? { backgroundColor: "#c8e6c9" } : {}),
                  }}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={6}
                      style={{
                        display: "grid",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "grid" }}>
                        <span
                          style={{ fontWeight: 500, fontSize: "0.87rem" }}
                          onMouseOver={() => {
                            // console.log(
                            //   "My SheetDetails need : ",
                            //   sheetDetails
                            // );

                            const filteredArray = [];
                            const selectedCells = new Set();
                            sheetDetails.forEach((form) => {
                              form.cellInfo.forEach((sheetCell) => {
                                if (
                                  sheetCell.dependentFields &&
                                  sheetCell.dependentFields.some(
                                    (depField) =>
                                      depField.cellId === cell.cellId
                                  )
                                ) {
                                  console.log("sheetCell : ", sheetCell);
                                  selectedCells.add(sheetCell.cellId); // Directly add the dependent field's cellId to the set
                                }
                              });
                            });

                            // console.log(
                            //   "Selected Cell on toggle : ",
                            //   selectedCells
                            // );

                            // Update the state with the updated selectedCells set
                            // setSelectedCells(new Set(selectedCells));

                            sheetDetails.forEach((form) => {
                              form.cellInfo.forEach((cell) => {
                                // Loop through each selected cell and match the cellId
                                selectedCells.forEach((selectedCellId) => {
                                  // Check if the cellId matches any of the selected cells
                                  if (cell.cellId === selectedCellId) {
                                    filteredArray.push(cell);
                                  }
                                });
                              });
                            });

                            // setResultArray(filteredArray);
                            const aliasIds =
                              filteredArray
                                .map((item) => item.aliasId)
                                .join(", ") || "";
                            setAliasIds(aliasIds);
                            // setSelectedCells(new Set());
                          }}
                        >
                          {/* <Tooltip
                            title={
                              <div style={{ whiteSpace: "pre-line" }}>
                                {`Field Type : ${cell.fieldType} \n Editable : ${cell.editable} \n Dependent : ${cell.dependent}\n DependentFileds : ${aliasIds}`}
                              </div>
                            }
                            arrow
                            // placement="right-start"
                            followCursor={true}
                          >
                            {cell.aliasId}
                            <br></br>
                            {cell.cellId}
                          </Tooltip> */}

                          <Badge
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            badgeContent={
                              // Badge to show creation time as a tooltip
                              <>
                                {cell.exception && (
                                  <Tooltip
                                    title={`AI Generated Exception for Field Type : ${cell.exception}`}
                                    placement="top"
                                  >
                                    <InfoIcon
                                      className="iconStyle"
                                      color="error"
                                    />{" "}
                                    {/* Icon to indicate creation time */}
                                  </Tooltip>
                                )}
                              </>
                            }
                          >
                            <Tooltip
                              title={
                                aliasIds ? (
                                  <div style={{ whiteSpace: "pre-line" }}>
                                    {`Field Type : ${
                                      cell.fieldType
                                    }\nEditable : ${
                                      cell.editable
                                    }\nDependent : ${true}\nDependentFields : ${aliasIds}`}
                                  </div>
                                ) : (
                                  <div style={{ whiteSpace: "pre-line" }}>
                                    {`Field Type : ${cell.fieldType} \n Editable : ${cell.editable}`}
                                  </div>
                                )
                              }
                              arrow
                              followCursor={true}
                            >
                              <span>
                                {cell.aliasId}

                                <br />
                                {cell.cellId}
                              </span>
                            </Tooltip>
                          </Badge>
                        </span>

                        {/* <span style={{ fontSize: "0.8rem" }}>
                          {cell.cellId}
                        </span> */}
                      </div>
                    </Grid>
                    <Grid container xs={6}>
                      <Grid container>
                        <Grid item xs={12}>
                          <div className="fieldType">
                            {cell.fieldType === "Date" && (
                              <>
                                <DateField
                                  elem={cell}
                                  // onDateChange={(e) =>
                                  //   onDateChange(e, elem, gridDataTest, setGridDataTest)
                                  // }
                                />
                              </>
                            )}
                            {cell.editable && cell.fieldType === "Number" && (
                              <NumberBox
                                label={cell.aliasId}
                                value={cell.value}
                                disabled={cell.disabled}
                                onNumberChange={() => {}}
                                onValueNumberChange={() => {}}
                                required={cell.requiredfield}
                                max={cell.maxVal}
                                min={cell.minVal}
                              />
                            )}
                            {cell.editable &&
                              cell.fieldType === "CommentBox" && (
                                <CommentBox
                                  label={cell.aliasId}
                                  value={cell.value}
                                  // onCommentChange={(e) =>
                                  //   onCommentChange(e, cell, gridDataTest, setGridDataTest)
                                  // }
                                  required={cell.requiredfield}
                                />
                              )}
                            {cell.editable && cell.fieldType === "Text" && (
                              <InputTextBox
                                // label={elem.aliasId}
                                // value={elem.value}
                                // disabled={elem.disabled}
                                // required={elem.requiredfield}
                                elem={cell}
                                // onTextChange={(e) =>
                                //   onTextChange(
                                //     e,
                                //     elem,
                                //     gridDataTest,
                                //     setGridDataTest,
                                //     pollObj,
                                //     setPollObj
                                //   )
                                // }
                              />
                            )}
                            {cell.fieldType === "Button" && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                // endIcon={values.isPlay ? <PauseIcon /> : <PlayArrowIcon />}
                                // onClick={(e) =>
                                //   handleButtonClick(
                                //     e,
                                //     elem,
                                //     gridDataTest,
                                //     setGridDataTest,
                                //     pollObj,
                                //     setPollObj
                                //   )
                                // }
                              >
                                {cell.buttonKeyValue}
                              </Button>
                            )}
                            {cell.fieldType === "Image" && (
                              <Image
                                elem={cell}
                                height={30}
                                // width={elem.imgWidth}
                                width={30}
                              />
                            )}
                            {cell.editable && cell.fieldType === "Dropdown" && (
                              <Dropdown
                                elem={cell}
                                //  onCellValueChange={(e) =>
                                //    onCellValueChange(
                                //      e,
                                //      elem,
                                //      gridDataTest,
                                //      setGridDataTest,
                                //      pollObj,
                                //      setPollObj
                                //    )
                                //  }
                              />
                            )}
                            {cell.editable && cell.fieldType === "DateTime" && (
                              <DateTimeField
                                elem={cell}
                                // onDateTimeChange={(e) =>
                                //   onDateTimeChange(e, elem, gridDataTest, setGridDataTest)
                                // }
                              />
                            )}
                            {cell.fieldType === "Time" && (
                              <TimeField elem={cell} />
                            )}

                            {cell.editable && cell.fieldType === "Boolean" && (
                              <Checkbox
                                title={cell.aliasId}
                                checked={cell.tickVal || false}
                                // onChange={(e) =>
                                //   onBooleanChange(e, elem, gridDataTest, setGridDataTest)
                                // }
                                required={cell.requiredfield}
                                // disabled={!elem.editable || elem.disabled}
                              />
                            )}
                            {cell.fieldType === "URL" && (
                              <Button
                                iconPos="right"
                                icon={"pi pi-external-link"}
                                label={cell.url}
                                link
                                onClick={() =>
                                  window.open(`http://${cell.url}`, "_blank")
                                }
                              />
                            )}
                            {/* {cell.fieldType === "File" && ( */}
                            {cell.fieldType === "File" && (
                              // <Button
                              //   iconPos="right"
                              //   icon={"pi pi-external-link"}
                              //   label={cell.url}
                              //   link
                              //   onClick={() =>
                              //     window.open(`http://${cell.url}`, "_blank")
                              //   }
                              // />

                              <MuiButton
                                // disabled={
                                //   elem.fileContent === null ||
                                //   elem.fileContent === undefined ||
                                //   elem.fileContent === ""
                                // }
                                variant="contained"
                                color="success"
                                startIcon={<DownloadForOfflineIcon />}
                                // endIcon={values.isPlay ? <PauseIcon /> : <PlayArrowIcon />}
                                // onClick={(e) =>
                                //   handleDownloadButton(
                                //     e,
                                //     elem,
                                //     gridDataTest,
                                //     setGridDataTest,
                                //     pollObj,
                                //     setPollObj
                                //   )
                                // }
                                // onClick={() =>
                                //   handleDownloadTest(elem, gridDataTest, setGridDataTest)
                                // }
                              >
                                File
                              </MuiButton>

                              // <FileDownloadComponent
                              //   byteArray={cell.fileContent}
                              // />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <div>
                            <div
                              className=""
                              style={{
                                background: "",
                                display: "flex",
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                columnGap: "0.4rem",
                                rowGap: "0.2rem",
                                flexWrap: "wrap",
                              }}
                            >
                              {!copyMode && (
                                <>
                                  {!showCheckbox &&
                                    (tableForm?.publicAccess === true ||
                                      (tableForm?.publicAccess === false &&
                                        loggedInUser?.trim() ===
                                          tableForm?.userId?.trim()) ||
                                      tableForm === null) && (
                                      <i
                                        className="pi pi-clone"
                                        style={{
                                          cursor: "pointer",
                                          background: "white",
                                          fontSize: "0.8rem",
                                          borderRadius: "1rem",
                                          border:
                                            "1px solid rgb(219, 219, 219)", // Subtle border for definition
                                          transform: "translateZ(0)", // Maintain sharp rendering
                                          padding: "4px", // Ensure spacing around icon
                                          transition: "all 0.2s ease", // Smooth transitions
                                          color: "#263238",
                                        }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyCell(cell); // Assuming handleCopyCell is a function to copy the cell's content
                                        }}
                                      />
                                    )}

                                  {!showCheckbox && (
                                    <i
                                      className="pi pi-cog"
                                      onClick={() => {
                                        if (copyMode) {
                                          // handlePasteCell(cell);
                                        } else {
                                          setClickedCell(cell);
                                          // setClickedCellForIcon(cell);
                                          setVisible(true);
                                          setWithToggle(false);
                                          console.log("Clicked Cell : ", cell);
                                        }
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        background: "white",
                                        borderRadius: "1rem",
                                        fontSize: "0.8rem",
                                        // boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                                        transform: "translateZ(0)", // Maintain sharp rendering
                                        border: "1px solid rgb(185, 185, 185)", // Subtle border for definition
                                        padding: "4px", // Ensure spacing around icon
                                        transition: "all 0.2s ease", // Smooth transitions
                                        color: "#263238",
                                      }}
                                      // onClick={(e) => {
                                      //   e.stopPropagation();
                                      //   handleCopyCell(cell);
                                      // }}
                                    ></i>
                                  )}
                                  {(tableForm?.publicAccess === true ||
                                    (tableForm?.publicAccess === false &&
                                      loggedInUser?.trim() ===
                                        tableForm?.userId?.trim()) ||
                                    tableForm === null) && (
                                    <InputSwitch
                                      checked={
                                        switchStates[cell.cellId] || false
                                      }
                                      className="logbookInputSwitchbtn"
                                      size="small"
                                      disabled={
                                        showCheckbox &&
                                        cell.cellId !== toggledCell?.cellId
                                      }
                                      style={{
                                        // position: "absolute",
                                        // right: "4rem",
                                        // bottom: "6px",
                                        cursor: "pointer",
                                      }}
                                      onChange={(e) => {
                                        const newSwitchStates = {
                                          ...switchStates,
                                          [cell.cellId]: e.value, // Update state for this specific cell
                                          toggledCellId: cell.cellId,
                                        };
                                        setSwitchStates(newSwitchStates);
                                        setSelectedCells(new Set());
                                        setClickedCell(null);
                                        // sheetDetails.forEach((form) => {
                                        //   form.cellInfo.forEach((sheetCell) => {
                                        //     if (
                                        //       sheetCell.dependentFields &&
                                        //       sheetCell.dependentFields.some(
                                        //         (depField) =>
                                        //           depField.cellId ===
                                        //           cell.cellId
                                        //       )
                                        //     ) {
                                        //       console.log(
                                        //         "sheetCell : ",
                                        //         sheetCell
                                        //       );
                                        //       selectedCells.add(
                                        //         sheetCell.cellId
                                        //       ); // Directly add the dependent field's cellId to the set
                                        //     }
                                        //   });
                                        // });

                                        // console.log(
                                        //   "Selected Cell on toggle : ",
                                        //   selectedCells
                                        // );

                                        // // Update the state with the updated selectedCells set
                                        // setSelectedCells(
                                        //   new Set(selectedCells)
                                        // );
                                        setToggledCell(cell);
                                        // Check if any switch is on, update showCheckbox accordingly
                                        // const updatedSelectedCells = new Set(selectedCells); // Make a copy of selectedCells
                                        // console.log(
                                        //   "resultArray in function : ",
                                        //   resultArray
                                        // );
                                        // if (resultArray && Array.isArray(resultArray)) {
                                        //   resultArray.forEach((field) => {
                                        //     if (field.cellId) {
                                        //       updatedSelectedCells.add(field.cellId); // Add dependent field's cellId to the set
                                        //     }
                                        //   });
                                        // }
                                        // setSelectedCells(updatedSelectedCells);
                                        // console.log(
                                        //   "cell for check box fill : ",
                                        //   updatedSelectedCells
                                        // );
                                        setShowCheckbox(
                                          checkIfAnySwitchIsOn(newSwitchStates)
                                        );

                                        console.log(
                                          `CellId: ${
                                            cell.cellId
                                          }, Switch is now: ${
                                            e.value ? "On" : "Off"
                                          }`
                                        );
                                        setWithToggle(true);
                                        // If switch is turned off, handle the selected cells logic
                                        if (!e.value) {
                                          // handleSwitchOff();
                                          setWithToggle(false);
                                          setSwitchStates({});
                                          setSelectedCells(new Set());
                                          setToggledCell(null);
                                          setClickedCell(null);
                                        }
                                      }}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            {copyMode &&
                              copiedCell?.cellId !== cell.cellId &&
                              !isPasted && (
                                <ContentPasteIcon
                                  fontSize=""
                                  sx={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePasteCell(cell);
                                    // setClickedCell(cell)
                                    setClickedCellForIcon(cell);
                                  }}
                                />
                              )}

                            {showCheckbox &&
                              cell.cellId === toggledCell?.cellId && (
                                <i
                                  className="pi pi-cog"
                                  onClick={() => {
                                    if (copyMode) {
                                      // handlePasteCell(cell);
                                    } else {
                                      setClickedCell(cell);
                                      // setClickedCellForIcon(cell);
                                      setVisible(true);
                                      setWithToggle(true);
                                      console.log("Clicked Cell1 : ", cell);
                                      // setToggledCell(null);
                                      console.log(
                                        "My switch States : ",
                                        switchStates
                                      );
                                      // handleSwitchOff();
                                    }
                                  }}
                                  style={{
                                    // position: "absolute",
                                    // top: "45px",
                                    // right: "5px",
                                    marginTop: "2px",
                                    cursor: "pointer",
                                    background: "white",
                                    borderRadius: "1rem",
                                    //boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                                    transform: "translateZ(0)", // Maintain sharp rendering
                                    border: "1px solid rgb(201, 200, 200)", // Subtle border for definition
                                    padding: "4px", // Ensure spacing around icon
                                    transition: "all 0.2s ease", // Smooth transitions
                                    color: "black",
                                  }}
                                  // onClick={(e) => {
                                  //   e.stopPropagation();
                                  //   handleCopyCell(cell);
                                  // }}
                                ></i>
                              )}

                            {showCheckbox &&
                              cell.cellId !== toggledCell?.cellId && (
                                <Checkbox
                                  checked={selectedCells.has(cell.cellId)} // Check if cell is selected
                                  style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    cursor: "pointer",
                                  }}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, cell)
                                  } // Handle checkbox change
                                />
                              )}

                            {/* Display Completed Icon if the cell has been clicked */}
                            {/* {(isPasted || isClicked) && ( */}
                            {(isPasted || isClicked) && (
                              <CheckCircleIcon
                                fontSize=""
                                sx={{
                                  position: "absolute",
                                  top: "5px",
                                  left: "5px",
                                  color: "green",
                                  background: "white",
                                  borderRadius: "9px",
                                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                                  transform: "translateZ(0)", // Maintain sharp rendering
                                  // border: "1px solid #e0e0e0", // Subtle border for definition
                                  padding: "3px", // Ensure spacing around icon
                                  transition: "all 0.2s ease", // Smooth transitions
                                }}
                              />
                            )}
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <div>{`${cell.aliasId}(${cell.cellId})`}</div> */}

                  <div>
                    {/* <div>
                    {!copyMode && (
                      <>
                        {!showCheckbox && (
                          <i
                            className="pi pi-clone"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              cursor: "pointer",
                              background: "white",
                              borderRadius: "9px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                              transform: "translateZ(0)", // Maintain sharp rendering
                              // border: "1px solid #e0e0e0", // Subtle border for definition
                              padding: "3px", // Ensure spacing around icon
                              transition: "all 0.2s ease", // Smooth transitions
                              color: "black",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyCell(cell);
                            }}
                          ></i>
                        )}
                        {!showCheckbox && (
                          <i
                            className="pi pi-cog"
                            onClick={() => {
                              if (copyMode) {
                                // handlePasteCell(cell);
                              } else {
                                setClickedCell(cell);
                                // setClickedCellForIcon(cell);
                                setVisible(true);
                                console.log("Clicked Cell : ", cell);
                              }
                            }}
                            style={{
                              position: "absolute",
                              top: "45px",
                              right: "5px",
                              cursor: "pointer",
                              background: "white",
                              borderRadius: "9px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                              transform: "translateZ(0)", // Maintain sharp rendering
                              // border: "1px solid #e0e0e0", // Subtle border for definition
                              padding: "3px", // Ensure spacing around icon
                              transition: "all 0.2s ease", // Smooth transitions
                              color: "black",
                            }}
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   handleCopyCell(cell);
                            // }}
                          ></i>
                        )}

                        <InputSwitch
                          checked={switchStates[cell.cellId] || false} // Default to false if not set
                          size="small"
                          disabled={
                            showCheckbox && cell.cellId !== toggledCell?.cellId
                          }
                          style={{
                            position: "absolute",
                            top: "2px",
                            left: "5px",
                            cursor: "pointer",
                          }}
                          onChange={(e) => {
                            const newSwitchStates = {
                              ...switchStates,
                              [cell.cellId]: e.value, // Update state for this specific cell
                              toggledCellId: cell.cellId,
                            };
                            setSwitchStates(newSwitchStates);
                            setToggledCell(cell);
                            // Check if any switch is on, update showCheckbox accordingly
                            // const updatedSelectedCells = new Set(selectedCells); // Make a copy of selectedCells
                            // console.log(
                            //   "resultArray in function : ",
                            //   resultArray
                            // );
                            // if (resultArray && Array.isArray(resultArray)) {
                            //   resultArray.forEach((field) => {
                            //     if (field.cellId) {
                            //       updatedSelectedCells.add(field.cellId); // Add dependent field's cellId to the set
                            //     }
                            //   });
                            // }
                            // setSelectedCells(updatedSelectedCells);
                            // console.log(
                            //   "cell for check box fill : ",
                            //   updatedSelectedCells
                            // );
                            setShowCheckbox(
                              checkIfAnySwitchIsOn(newSwitchStates)
                            );

                            console.log(
                              `CellId: ${cell.cellId}, Switch is now: ${
                                e.value ? "On" : "Off"
                              }`
                            );

                            // If switch is turned off, handle the selected cells logic
                            if (!e.value) {
                              // handleSwitchOff();
                              setSwitchStates({});
                              setSelectedCells(new Set());
                              setToggledCell(null);
                            }
                          }}
                        />
                      </>
                    )}

                    {copyMode &&
                      copiedCell?.cellId !== cell.cellId &&
                      !isPasted && (
                        <ContentPasteIcon
                          fontSize=""
                          sx={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePasteCell(cell);
                            // setClickedCell(cell)
                            setClickedCellForIcon(cell);
                          }}
                        />
                      )}

                    {showCheckbox && cell.cellId === toggledCell?.cellId && (
                      <i
                        className="pi pi-cog"
                        onClick={() => {
                          if (copyMode) {
                            // handlePasteCell(cell);
                          } else {
                            setClickedCell(cell);
                            // setClickedCellForIcon(cell);
                            setVisible(true);
                            console.log("Clicked Cell : ", cell);
                            setToggledCell(null);
                            // handleSwitchOff();
                          }
                        }}
                        style={{
                          position: "absolute",
                          top: "45px",
                          right: "5px",
                          cursor: "pointer",
                          background: "white",
                          borderRadius: "9px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                          transform: "translateZ(0)", // Maintain sharp rendering
                          // border: "1px solid #e0e0e0", // Subtle border for definition
                          padding: "3px", // Ensure spacing around icon
                          transition: "all 0.2s ease", // Smooth transitions
                          color: "black",
                        }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   handleCopyCell(cell);
                        // }}
                      ></i>
                    )}

                    {showCheckbox && cell.cellId !== toggledCell?.cellId && (
                      <Checkbox
                        checked={selectedCells.has(cell.cellId)} // Check if cell is selected
                        style={{
                          position: "absolute",
                          bottom: "5px",
                          left: "5px",
                          cursor: "pointer",
                        }}
                        onChange={(e) => handleCheckboxChange(e, cell)} // Handle checkbox change
                      />
                    )}

                  
                    {(isPasted || isClicked) && (
                      <CheckCircleIcon
                        fontSize=""
                        sx={{
                          position: "absolute",
                          top: "5px",
                          left: "5px",
                          color: "green",
                          background: "white",
                          borderRadius: "9px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                          transform: "translateZ(0)", // Maintain sharp rendering
                          // border: "1px solid #e0e0e0", // Subtle border for definition
                          padding: "3px", // Ensure spacing around icon
                          transition: "all 0.2s ease", // Smooth transitions
                        }}
                      />
                    )}
                    </div> */}
                    {/* <div className="fieldType">
                    {cell.fieldType === "Date" && (
                      <>
                        <DateField
                          elem={cell}
                          // onDateChange={(e) =>
                          //   onDateChange(e, elem, gridDataTest, setGridDataTest)
                          // }
                        />
                      </>
                    )}
                    {cell.editable && cell.fieldType === "Number" && (
                      <NumberBox
                        label={cell.aliasId}
                        value={cell.value}
                        disabled={cell.disabled}
                        // onNumberChange={(e) =>
                        //   onNumberChange(e, elem, gridDataTest, setGridDataTest)
                        // }
                        required={cell.requiredfield}
                        max={cell.maxVal}
                        min={cell.minVal}
                      />
                    )}
                    {cell.editable && cell.fieldType === "CommentBox" && (
                      <CommentBox
                        label={cell.aliasId}
                        value={cell.value}
                        // onCommentChange={(e) =>
                        //   onCommentChange(e, cell, gridDataTest, setGridDataTest)
                        // }
                        required={cell.requiredfield}
                      />
                    )}
                    {cell.editable && cell.fieldType === "Text" && (
                      <InputTextBox
                        // label={elem.aliasId}
                        // value={elem.value}
                        // disabled={elem.disabled}
                        // required={elem.requiredfield}
                        elem={cell}
                        // onTextChange={(e) =>
                        //   onTextChange(
                        //     e,
                        //     elem,
                        //     gridDataTest,
                        //     setGridDataTest,
                        //     pollObj,
                        //     setPollObj
                        //   )
                        // }
                      />
                    )}
                    {cell.fieldType === "Button" && (
                      <Button
                        variant="contained"
                        color="primary"
                        // endIcon={values.isPlay ? <PauseIcon /> : <PlayArrowIcon />}
                        // onClick={(e) =>
                        //   handleButtonClick(
                        //     e,
                        //     elem,
                        //     gridDataTest,
                        //     setGridDataTest,
                        //     pollObj,
                        //     setPollObj
                        //   )
                        // }
                      >
                        {cell.buttonKeyValue}
                      </Button>
                    )}
                    {cell.fieldType === "Image" && (
                      <Image
                        elem={cell}
                        height={30}
                        // width={elem.imgWidth}
                        width={30}
                      />
                    )}
                    {cell.editable && cell.fieldType === "Dropdown" && (
                      <Dropdown
                        elem={cell}
                        //  onCellValueChange={(e) =>
                        //    onCellValueChange(
                        //      e,
                        //      elem,
                        //      gridDataTest,
                        //      setGridDataTest,
                        //      pollObj,
                        //      setPollObj
                        //    )
                        //  }
                      />
                    )}
                    {cell.editable && cell.fieldType === "DateTime" && (
                      <DateTimeField
                        elem={cell}
                        // onDateTimeChange={(e) =>
                        //   onDateTimeChange(e, elem, gridDataTest, setGridDataTest)
                        // }
                      />
                    )}
                    {cell.fieldType === "Time" && <TimeField elem={cell} />}

                    {cell.editable && cell.fieldType === "Boolean" && (
                      <Checkbox
                        title={cell.aliasId}
                        checked={cell.tickVal || false}
                        // onChange={(e) =>
                        //   onBooleanChange(e, elem, gridDataTest, setGridDataTest)
                        // }
                        required={cell.requiredfield}
                        // disabled={!elem.editable || elem.disabled}
                      />
                    )}
                    {cell.fieldType === "URL" && (
                      <Button
                        iconPos="right"
                        icon={"pi pi-external-link"}
                        label={cell.url}
                        link
                        onClick={() =>
                          window.open(`http://${cell.url}`, "_blank")
                        }
                      />
                    )}
                    {cell.fieldType === "File" && (
                      // <Button
                      //   iconPos="right"
                      //   icon={"pi pi-external-link"}
                      //   label={cell.url}
                      //   link
                      //   onClick={() =>
                      //     window.open(`http://${cell.url}`, "_blank")
                      //   }
                      // />
                      <FileDownloadComponent byteArray={cell.fileContent} />
                    )}
                    </div> */}
                  </div>
                </Paper>
              );
            })
          )}
          {gridProperties?.occupiedGrid.map((row, rowIndex) =>
            row.map((isOccupied, colIndex) => {
              if (!isOccupied) {
                return (
                  <Paper
                    key={`empty-${rowIndex}-${colIndex}`}
                    elevation={0} // No shadow for empty cells
                    sx={{
                      gridColumn: `span ${colIndex + 1}`,
                      gridRow: `span ${rowIndex + 1}`,
                      gridColumnStart: colIndex + 1,
                      gridRowStart: rowIndex + 1,
                      padding: "35px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      border: "2px",
                      // borderColor: "black",
                      //backgroundColor: "red", // Light background for empty cells
                      boxShadow: 2,
                    }}
                  />
                );
              }
              return null; // Return null for occupied spaces
            })
          )}
        </Box>
        <Dialog
          className="dialogHeaderStyle"
          header={
            <>
              <span className="font-bold text-sm">
                {clickedCell?.aliasId} ({clickedCell?.cellId})
              </span>
            </>
          }
          maximizable
          blockScroll
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            setVisible(false);
            setWithToggle(false);
            setClickedCell(null);
            setToggledCell(null);
            setSwitchStates({});
            setShowCheckbox(false);
            handleCancelCopyMode();
            setSelectedCells(new Set());
            setResultArray([]);
          }}
        >
          <FormDesign
            tableForm={tableForm}
            cell={clickedCell}
            setClickedCell={setClickedCell}
            setVisible={setVisible}
            setClickedCellForIcon={setClickedCellForIcon}
            clickedCellForIcon={clickedCellForIcon}
            setShowCheckbox={setShowCheckbox}
            setSwitchStates={setSwitchStates}
            setToggledCell={setToggledCell}
            setSelectedCells={setSelectedCells}
            selectedCells={selectedCells}
            depDataList={resultArray}
            setResultArray={setResultArray}
            setWithToggle={setWithToggle}
          />
        </Dialog>
      </div>
    </>
  );
};

export default FormGrid;
