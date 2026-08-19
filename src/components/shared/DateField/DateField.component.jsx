import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect } from "react";

// Extend dayjs with the customParseFormat plugin
dayjs.extend(customParseFormat);

function DateField({
  elem,
  onDateChange,
  setGridDataTest,
  gridDataTest,
  error,
  helperText,
}) {
  console.log("elem.value : ", elem.value);

  // Try to parse the date explicitly using dayjs with customParseFormat plugin
  const parsedDate = dayjs(elem.value, ["DD-MM-YYYY", "YYYY-MM-DD"], true); // Allow parsing both formats
  console.log(
    "Parsed date : ",
    parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "Invalid Date"
  );

  useEffect(() => {
    if (gridDataTest) {
      let updatedGridDataTest = gridDataTest.map((item) => ({
        ...item,
        cellData: item.cellData.map((cell) => {
          if (cell.cellId === elem.cellId) {
            return {
              ...cell,
              value: elem.value
                ? parsedDate.isValid()
                  ? parsedDate.format("YYYY-MM-DD")
                  : null
                : // dayjs(new Date()).format("YYYY-MM-DD")
                  null,
              // dayjs(new Date()).format("YYYY-MM-DD"),
            };
          }
          return cell;
        }),
      }));
      console.log("Updated grid data for date: ", updatedGridDataTest);
      setGridDataTest(updatedGridDataTest);
    }
  }, []);

  return (
    <>
      {elem.requiredfield && <span style={{ color: "red" }}>*</span>}{" "}
      <Calendar
        value={
          parsedDate.isValid() ? new Date(parsedDate) : null
          // new Date(dayjs(new Date()))
        }
        onChange={onDateChange}
        showIcon
        disabled={!elem.editable || elem.disabled}
        dateFormat="dd-mm-yy"
        required={elem.requiredfield}
        invalid={
          error &&
          (elem.value === null || elem.value === undefined || elem.value === "")
        }
      />
      {error &&
        (elem.value === null ||
          elem.value === undefined ||
          elem.value === "") && (
          <small style={{ color: "red" }}>{helperText}</small>
        )}{" "}
    </>
  );
}

export default DateField;
