import { Button, Grid, Paper, TextField } from "@mui/material";

import React, { useEffect } from "react";
import { useState } from "react";
import { getAllCellInfoByFormNameAndVersion } from "../Logbook/LogbookApi";
import Label from "../components/shared/Label/Label.component";

async function findSQL(sql, elem, gridData) {
  try {
    while (sql.includes("{{")) {
      let firstIndex = sql.indexOf("{{") + 2;
      let lastIndex = sql.indexOf("}}");

      let cellId = sql.substring(firstIndex, lastIndex);

      let cellValue = await findCellValue(cellId, elem, gridData);
      sql = sql
        .replace(cellId, cellValue === "'" + null + "'" ? "''" : cellValue)
        .replace("{{", "")
        .replace("}}", "");
    }
    console.log(elem.cellId + " final sql is:" + sql);
    return sql;
  } catch (error) {
    console.error("Error fetching SQL:", error);
    return "";
  }
}

function findCellValue(cellId, elem, gridData) {
  for (let rowNum = 0; rowNum < gridData.length; rowNum++) {
    let rowData = gridData[rowNum];

    for (let colNum = 0; colNum < rowData.cellData.length; colNum++) {
      let cid = rowData.cellData[colNum].cellId;
      if (cid === cellId) {
        if (rowData.cellData[colNum].fieldType === "Number") {
          return rowData.cellData[colNum].value;
        } else {
          return "'" + rowData.cellData[colNum].value + "'";
        }
      }
    }
  }
}

function LogbookFormtest() {
  const formName = "72053 Vivel BW Mint Cucumber";
  const versionNumber = "1";

  const [gridDataTest, setGridDataTest] = useState([]);
  const [colTot, setColTot] = useState();

  const [pollObj, setPollObj] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let data = await getAllCellInfoByFormNameAndVersion(
        formName,
        versionNumber
      );

      setGridDataTest(data);

      setColTot(() =>
        data[0].cellData.reduce((sum, elem) => sum + elem.colsSpan, 0)
      );
    }
    fetchData();
    getTransactionsByFormnameAndVersion();
  }, []);

  console.log(gridDataTest);

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${colTot}, 1fr)`,
    gap: "2px",
    position: "relative",
    height: "100px",
  };

  const convertCssStringToMuiStyles = (cssString) => {
    if (!cssString) {
      return {};
    }
    const cssArray = cssString.split(";").map((style) => style.trim());
    const muiStyles = {};

    cssArray.forEach((style) => {
      const [property, value] = style.split(":").map((part) => part.trim());
      if (property && value) {
        const camelCaseProperty = property.replace(
          /-([a-z])/g,
          (match, letter) => letter.toUpperCase()
        );
        muiStyles[camelCaseProperty] = value;
      }
    });

    return muiStyles;
  };

  const getTransactionsByFormnameAndVersion = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/logbook/getTransactionsByFormnameAndVersion?formName=" +
          formName +
          "&version=" +
          versionNumber
      );
      const data = await response.json();
      setData(data);
      console.log("getTransactionsByFormnameAndVersion : ", data.payload);
      console.log(
        "data.payload[0].logbookData : ",
        data.payload[0].logbookData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid style={containerStyle}>
        {gridDataTest.map((item, index) =>
          item.cellData.map((elem, ind) => (
            <Paper
              key={elem.cellId}
              style={{
                padding: "20px",
                gridColumn: `span ${elem.colsSpan}`,
                gridRow: `span ${elem.rowSpan}`,
                ...convertCssStringToMuiStyles(elem.cellCss),
              }}
            >
              {elem.editable ? (
                data.payload[0].logbookData.hasOwnProperty(elem.cellId) ? (
                  <TextField
                    value={data.payload[0].logbookData[elem.cellId].value}
                  />
                ) : (
                  <TextField label={elem.aliasId} />
                )
              ) : (
                <Label
                  elem={elem}
                  pollObj={pollObj}
                  setPollObj={setPollObj}
                  gridDataTest={gridDataTest}
                  setGridDataTest={setGridDataTest}
                  findSQL={findSQL}
                />
              )}
            </Paper>
          ))
        )}
        <div style={{ margin: "20px" }}>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </div>
      </Grid>
    </>
  );
}

export default LogbookFormtest;
