// import { Typography } from "@mui/material";
// import React, { useEffect, useRef } from "react";
// import { getRestData } from "../../../Logbook/LogbookApi";

// // Custom hook: useInterval
// function useInterval(callback, delay) {
//   const savedCallback = useRef();
//   const intervalRef = useRef();

//   // Remember the latest callback
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   useEffect(() => {
//     // Only set up the interval if the delay is greater than 0
//     if (delay !== null && delay > 0) {
//       console.log("Starting interval with delay:", delay);

//       // Clear existing interval if there's any
//       if (intervalRef.current) {
//         console.log("Clearing existing interval");
//         clearInterval(intervalRef.current);
//       }

//       // Set up the new interval
//       intervalRef.current = setInterval(() => {
//         console.log("Interval tick");
//         savedCallback.current();
//       }, delay);

//       // Cleanup the interval when component unmounts or when delay changes
//       return () => {
//         console.log("Cleaning up interval on unmount or delay change");
//         clearInterval(intervalRef.current);
//       };
//     } else {
//       console.log("Polling is disabled: no interval set");
//       return undefined;
//     }
//   }, [delay]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) {
//         console.log("Cleaning up interval on unmount");
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);
// }

// // Custom hook: useEffectCallback
// function useEffectCallback(callback, dependencies) {
//   useEffect(() => {
//     callback();
//   }, dependencies); // Run the callback whenever dependencies change
// }

// // LabelApi Component
// function LabelApi({
//   elem,
//   pollObj,
//   setPollObj,
//   gridDataTest,
//   setGridDataTest,
//   findSQL,
//   getQueryResultForGlobalCellUpdate,
// }) {
//   console.log("Cell for API: ", elem);
//   console.log("Poll Object: ", pollObj);

//   // Find the current cell object in the polling configuration
//   const cellObj = pollObj.find((item) => elem.cellId === item.cell.cellId) || {
//     autoRefresh: false,
//     pollInterval: null,
//     cell: null,
//   };

//   console.log("Cell Object Retrieved: ", cellObj);

//   // Calculate the delay for the interval in milliseconds
//   const delay =
//     cellObj.autoRefresh && cellObj.pollInterval
//       ? cellObj.pollInterval * 1000
//       : null;

//   console.log("Calculated delay:", delay);

//   // Polling mechanism: Executes when pollInterval is set and autoRefresh is true
//   useInterval(
//     async () => {
//       if (!cellObj.autoRefresh || cellObj.pollInterval === null) {
//         console.log(
//           "Polling skipped due to autoRefresh being false or pollInterval being null."
//         );
//         return; // Skip polling if autoRefresh is false or pollInterval is null
//       }

//       let api = "";

//       // Determine the API URL
//       if (cellObj.cell !== null) {
//         api = await findSQL(cellObj.cell.apiUrl, cellObj.cell, gridDataTest);
//       } else {
//         api = await findSQL(elem.apiUrl, elem.cell, gridDataTest);
//       }

//       try {
//         console.log("Calling API with URL:", api);
//         // Fetch data from the API
//         const restData = await getRestData(api);
//         console.log("API Response:", restData);

//         // Update grid data with the API response
//         setGridDataTest((prevArray) =>
//           prevArray.map((item) => ({
//             ...item,
//             cellData: item.cellData.map((cell) => {
//               if (cell.cellId === cellObj.cell.cellId) {
//                 return {
//                   ...cell,
//                   value: Object.values(restData)[0], // Use the first value from the API response
//                 };
//               }
//               return cell;
//             }),
//           }))
//         );
//       } catch (error) {
//         console.error("Error during API polling:", error);
//       }
//     },
//     delay // Only set the interval if delay is not null or 0
//   );

//   // Initial data fetching on component mount or dependencies change
//   useEffectCallback(async () => {
//     if (!cellObj.autoRefresh || cellObj.pollInterval === null) {
//       console.log("Initial fetch is skipped due to disabled polling.");
//       return;
//     }

//     let api = "";

//     // Determine the API URL
//     if (cellObj.cell !== null) {
//       api = await findSQL(cellObj.cell.apiUrl, cellObj.cell, gridDataTest);
//     } else {
//       api = await findSQL(elem.apiUrl, elem.cell, gridDataTest);
//     }

//     try {
//       console.log("Initial API call with URL:", api);
//       // Fetch data from the API
//       const restData = await getRestData(api);
//       console.log("Initial API Response:", restData);

//       // Update grid data with the API response
//       setGridDataTest((prevArray) =>
//         prevArray.map((item) => ({
//           ...item,
//           cellData: item.cellData.map((cell) => {
//             if (cell.cellId === elem.cellId) {
//               return {
//                 ...cell,
//                 value: Object.values(restData)[0], // Assign the first value from the API response
//               };
//             }
//             return cell;
//           }),
//         }))
//       );
//     } catch (error) {
//       console.error("Error during initial data fetch:", error);
//     }
//   }, [cellObj.cell]);

//   // Ensure we're rendering a string or number, not an object
//   // Ensure we're rendering a string or number, not an object
//   const renderValue =
//     elem.value && typeof elem.value === "object" && elem.value.result
//       ? elem.value.result
//       : elem.value || elem.aliasId; // If elem.value is null or undefined, show 'No result'

//   return (
//     <Typography title={elem.aliasId} variant="h6">
//       {renderValue}
//     </Typography>
//   );
// }

// export default LabelApi;

import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { getRestData } from "../../../Logbook/LogbookApi";

// Custom hook: useInterval
function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalRef = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null && delay > 0) {
      console.log("Starting interval with delay:", delay);

      if (intervalRef.current) {
        console.log("Clearing existing interval");
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        console.log("Interval tick");
        savedCallback.current();
      }, delay);

      return () => {
        console.log("Cleaning up interval on unmount or delay change");
        clearInterval(intervalRef.current);
      };
    } else {
      console.log("Polling is disabled: no interval set");
      return undefined;
    }
  }, [delay]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        console.log("Cleaning up interval on unmount");
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

// Custom hook: useEffectCallback
function useEffectCallback(callback, dependencies) {
  useEffect(() => {
    callback();
  }, dependencies);
}
const parseCssString = (cssString) => {
  const toCamelCase = (str) =>
    str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  return cssString
    ? cssString.split(";").reduce((acc, rule) => {
        const [property, value] = rule.split(":");
        if (property && value) {
          const key = toCamelCase(property.trim());
          let val = value.trim();

          // Convert fontSize to number if possible
          if (key === "fontSize") {
            if (val.endsWith("px")) val = parseInt(val, 10);
            else if (!isNaN(Number(val))) val = Number(val);
          }
          // Convert fontWeight to number if possible
          if (key === "fontWeight") {
            if (!isNaN(Number(val))) val = Number(val);
          }
          acc[key] = val;
        }
        return acc;
      }, {})
    : {};
};
// LabelApi Component
function LabelApi({
  elem,
  pollObj,
  setPollObj,
  gridDataTest,
  setGridDataTest,
  findSQL,
  getQueryResultForGlobalCellUpdate,
}) {
  const parsedStyles = parseCssString(elem.cellCSS);
  console.log("Cell for API: ", elem);
  console.log("Poll Object: ", pollObj);

  const cellObj = pollObj.find((item) => elem.cellId === item.cell.cellId) || {
    autoRefresh: false,
    pollInterval: null,
    cell: null,
  };

  console.log("Cell Object Retrieved: ", cellObj);

  const delay =
    cellObj.autoRefresh && cellObj.pollInterval
      ? cellObj.pollInterval * 1000
      : null;

  console.log("Calculated delay:", delay);

  // Polling mechanism
  useInterval(async () => {
    if (!cellObj.autoRefresh || cellObj.pollInterval === null) {
      console.log(
        "Polling skipped due to autoRefresh being false or pollInterval being null."
      );
      return;
    }

    let api = "";
    if (cellObj.cell !== null) {
      console.log(
        "cell OBJ autoRefresh api : ",
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic
      );
      api = await findSQL(
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic,
        cellObj.cell,
        gridDataTest
      );
    } else {
      console.log(
        "cell obj else autoRefresh api : ",
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic
      );
      api = await findSQL(
        elem.apiUrl || elem.depExpressionLogic,
        elem.cell,
        gridDataTest
      );
    }

    try {
      console.log("Calling API with URL:", api);
      const restData = await getRestData(api);

      if (!restData) {
        console.warn("Received null or undefined response from API.");
        return;
      }

      console.log("API Response:", restData);

      setGridDataTest((prevArray) =>
        prevArray.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            if (cell.cellId === cellObj.cell.cellId) {
              return {
                ...cell,
                value: Object.values(restData)[0] || "",
              };
            }
            return cell;
          }),
        }))
      );
    } catch (error) {
      console.error("Error during API polling:", error);
    }
  }, delay);

  // Initial data fetching
  useEffectCallback(async () => {
    if (!cellObj.autoRefresh || cellObj.pollInterval === null) {
      console.log("Initial fetch is skipped due to disabled polling.");
      return;
    }

    let api = "";
    if (cellObj.cell !== null) {
      console.log(
        "Initial data in api : ",
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic
      );
      api = await findSQL(
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic,
        cellObj.cell,
        gridDataTest
      );
    } else {
      console.log(
        "else Initial data in api : ",
        cellObj.cell.apiUrl || cellObj.cell.depExpressionLogic
      );
      api = await findSQL(
        elem.apiUrl || elem.depExpressionLogic,
        elem.cell,
        gridDataTest
      );
    }

    try {
      console.log("Initial API call with URL:", api);
      const restData = await getRestData(api);

      if (!restData) {
        console.warn(
          "Received null or undefined response during initial fetch."
        );
        return;
      }

      console.log("Initial API Response:", restData);

      setGridDataTest((prevArray) =>
        prevArray.map((item) => ({
          ...item,
          cellData: item.cellData.map((cell) => {
            if (cell.cellId === elem.cellId) {
              return {
                ...cell,
                value: Object.values(restData)[0] || "",
              };
            }
            return cell;
          }),
        }))
      );
    } catch (error) {
      console.error("Error during initial data fetch:", error);
    }
  }, [cellObj.cell]);

  const renderValue =
    elem.value && typeof elem.value === "object" && elem.value.result
      ? elem.value.result
      : elem.value || elem.aliasId;

  return (
    // <Typography title={elem.aliasId} variant="h6">
    //   {renderValue}
    // </Typography>
    <span
      style={{
        fontWeight: parsedStyles.fontWeight || 500,
        fontSize: parsedStyles.fontSize || "0.95rem",
      }}
      // sx={{ ...parsedStyles }}
    >
      {renderValue}
    </span>
  );
}

export default LabelApi;
