import React from "react";
import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

function DateTimeField({
  elem,
  onDateTimeChange,
  setGridDataTest,
  gridDataTest,
  error,
  helperText,
}) {
  // ✅ This must match what you store in the grid!
  const storagePattern = "YYYY-MM-DD HH:mm:ss";

  const parsedDate = dayjs(elem.value, storagePattern, true);
  const currentDate = parsedDate.isValid() ? parsedDate.toDate() : null;

  const isInvalid =
    error &&
    (!parsedDate.isValid() ||
      elem.value === null ||
      elem.value === undefined ||
      elem.value === "");

  const getPrimeReactDateFormat = () => "dd-mm-yy"; // calendar display only

  return (
    <>
      {elem.requiredfield && <span style={{ color: "red" }}>*</span>}{" "}
      <Calendar
        value={currentDate}
        onChange={(e) =>
          onDateTimeChange(e, elem, gridDataTest, setGridDataTest)
        }
        showIcon
        showTime
        showSeconds
        hideOnDateTimeSelect
        hourFormat="12"
        disabled={!elem.editable || elem.disabled}
        dateFormat={getPrimeReactDateFormat()}
        required={elem.requiredfield}
        className="logbookDateTimeFieldStyle"
        inputId={elem.cellId}
        name={elem.name || elem.cellId}
        invalid={isInvalid}
      />
      {isInvalid && <small style={{ color: "red" }}>{helperText}</small>}
    </>
  );
}

export default DateTimeField;
