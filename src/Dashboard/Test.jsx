import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import ButtonGroup from "@mui/material/ButtonGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Checkbox,
  Chip,
  Container,
  Divider,
  Fab,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import "./styles.css";
import ManufacturingTablesContainer from "./ManufacturingTablesContainer";
import AssetOrUserTableContainer from "./AssetOrUserTableContainer";
import { fetchLogbooksAndAssets } from "./DashboardAPI";
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { object } from "yup";

export default function DashboardTest({ visible, setVisible }) {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState("Task");
  const [logbooks, setLogbooks] = useState([]);
  const [selectedLogbook, setSelectedLogbook] = useState([]);
  const [selectAllLogbook, setSelectAllLogbook] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState([]);
  const [selectAllAsset, setSelectAllAsset] = useState(false);
  const [taskOrTagData, setTaskOrTagData] = useState("");
  const [assetOrUserData, setAssetOrUserData] = useState("");

  const [originalTaskOrTagData, setOriginalTaskOrTagData] = useState("");
  const [originalAssetOrUserData, setOriginalAssetOrUserData] = useState("");

  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState("");
  const [isTabularClick, setIsTebularClick] = useState(true);
  const [isCardClick, setIsCardClick] = useState(false);
  const [isTimelineClick, setIsTimelineClick] = useState(false);

  const [containerSize, setContainerSize] = useState("xl");

  useEffect(() => {
    console.log("I am test ");
    setLoading(true);
    fetchLogbooksAndAssets(fromDate, toDate, groupBy)
      .then(
        ([logbooksData, assetsData, tabularDataResponse, cardDataResponse]) => {
          if (Array.isArray(logbooksData)) {
            setLogbooks(logbooksData);
            setSelectAllLogbook(logbooksData);
            setSelectedLogbook(logbooksData);
          } else {
            console.error(
              "Logbooks data received is not an array:",
              logbooksData
            );
          }

          if (Array.isArray(assetsData)) {
            setAssets(assetsData);
            setSelectAllAsset(assetsData);
            setSelectedAsset(assetsData);
          } else {
            console.error("Assets data received is not an array:", assetsData);
          }

          if (groupBy === "Task" || groupBy === "Tag") {
            setTaskOrTagData(tabularDataResponse);
            setOriginalTaskOrTagData(tabularDataResponse);
            setAssetOrUserData();
            setCardData(cardDataResponse);
            setAssetOrUserData([]);
          }
          if (groupBy === "User" || groupBy === "Asset") {
            setTaskOrTagData([]);
            setOriginalAssetOrUserData(tabularDataResponse);
            setOriginalTaskOrTagData();
            setAssetOrUserData(tabularDataResponse);
            setCardData(cardDataResponse);
          }
          setLoading(false);
          setVisible(true);
        }
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [fromDate, toDate, groupBy]);

  const updateTableData = () => {
    console.log("Selected Logbooks: ", selectedLogbook);
    console.log("Selected Assets : ", selectedAsset);
    // console.log("taskOrTagData before filtering:", taskOrTagData);
    // console.log("assetOrUserData before filtering:", assetOrUserData);

    // console.log("keys : ", Object.keys(taskOrTagData));
    let finalTaskData = {};
    let finalAssetData = {};

    if (selectedLogbook.length > 0 && selectedAsset.length > 0) {
      if (originalTaskOrTagData) {
        for (const currentTask in originalTaskOrTagData) {
          // console.log("key : ", key);
          if (originalTaskOrTagData.hasOwnProperty(currentTask)) {
            const currentJobList = originalTaskOrTagData[currentTask];
            console.log("currentTask:", currentTask);
            console.log("currentJobList:", currentJobList);
            // let currentActivityListArray = [];
            let updatedJobList = [];
            currentJobList?.forEach((currentjob) => {
              let currentJobActivityList = [];

              console.log("Current Job : ", currentjob);
              currentjob?.actvityList?.forEach((currentActivity) => {
                // logbooks.push(element.logbook);
                if (selectedLogbook.includes(currentActivity.logbook)) {
                  const itemsArray = currentActivity.assetName
                    .split(",")
                    .map((item) => item.trim());
                  if (itemsArray.some((item) => selectedAsset.includes(item))) {
                    currentJobActivityList.push(currentActivity);
                  }
                }
              });
              if (currentJobActivityList.length === 0) {
                return;
              }
              const updatedJob = {
                ...currentjob,
                actvityList: currentJobActivityList,
              };
              updatedJobList.push(updatedJob);
            });
            if (updatedJobList.length > 0)
              finalTaskData = {
                ...finalTaskData,
                [currentTask]: updatedJobList,
              };
          }
        }
      }
      // console.log("Final Logbook : ", logbooks);

      console.log("Final Task : ", finalTaskData);
      setTaskOrTagData(finalTaskData);

      if (originalAssetOrUserData) {
        for (const currentTask in originalAssetOrUserData) {
          // console.log("key : ", key);
          if (originalAssetOrUserData.hasOwnProperty(currentTask)) {
            const currentJobList = originalAssetOrUserData[currentTask];
            // console.log("currentTask:", currentTask);
            // console.log("currentJobList:", currentJobList);
            // let currentActivityListArray = [];
            let updatedJobList = [];
            currentJobList?.forEach((currentjob) => {
              // let currentJobActivityList = [];

              console.log("Current Job : ", currentjob);
              // currentjob?.actvityList?.forEach((currentActivity) => {
              // logbooks.push(element.logbook);
              console.log("currentjob.logbook : ", currentjob.logBook);
              if (selectedLogbook.includes(currentjob.logBook)) {
                const itemsArray = currentjob.assets
                  .split(",")
                  .map((item) => item.trim());
                console.log("Item array : ", itemsArray);
                if (itemsArray.some((item) => selectedAsset.includes(item))) {
                  updatedJobList.push(currentjob);
                }
              }
              // });
              // if (currentJobActivityList.length === 0) {
              //   return;
              // }
              // const updatedJob = {
              //   ...currentjob,
              //   actvityList: currentJobActivityList,
              // };
              // updatedJobList.push(updatedJob);
            });
            console.log("updatedJobList : ", updatedJobList);
            if (updatedJobList.length > 0)
              finalAssetData = {
                ...finalAssetData,
                [currentTask]: updatedJobList,
              };
          }
        }
      }

      console.log("Final Asset : ", finalAssetData);
      setAssetOrUserData(finalAssetData);
    }
  };
  const handleSelectAllLogbookChange = (event) => {
    setSelectAllLogbook(event.target.checked);
    setSelectedLogbook(event.target.checked ? logbooks : []);
  };

  const handleSelectLogbookChange = (event) => {
    setSelectedLogbook(event.target.value);
    setSelectAllLogbook(false);
  };

  const handleSelectAllAssetChange = (event) => {
    setSelectAllAsset(event.target.checked);
    setSelectedAsset(event.target.checked ? assets : []);
  };

  const handleSelectAssetChange = (event) => {
    setSelectedAsset(event.target.value);
    setSelectAllAsset(false);
  };

  const handleCardClick = () => {
    setContainerSize("lg");
    setIsCardClick(true);
    setIsTimelineClick(false);
    setIsTebularClick(false);
    setVisible(false);
  };

  const handleTimelineClick = () => {
    setIsCardClick(false);
    setIsTimelineClick(true);
    setIsTebularClick(false);
  };

  const handleTabularClick = () => {
    setContainerSize("xl");
    setIsCardClick(false);
    setIsTimelineClick(false);
    setIsTebularClick(true);
    setVisible(false);
  };
  const handleSubmit = () => {
    updateTableData();
  };

  return (
    <div
      className="card flex justify-content-center"
      // style={{ zIndex: "-99999999999999999" }}
    >
      <Sidebar
        // style={{ zIndex: "99999999999999999" }}
        visible={visible}
        onHide={() => setVisible(false)}
        position="right"
      >
        <div>
          <div className="flex-auto" style={{ marginTop: "0.7rem" }}>
            <label htmlFor="fromDate" className="font-bold block mb-2">
              From Date
            </label>
            <Calendar
              id="fromDate"
              showButtonBar
              showIcon
              value={fromDate}
              onChange={(e) => setFromDate(e.value)}
              variant="outlined"
            />

            <label htmlFor="toDate" className="font-bold block mb-2">
              To Date
            </label>
            <Calendar
              id="toDate"
              showButtonBar
              value={toDate}
              onChange={(e) => setToDate(e.value)}
              showIcon
            />
          </div>

          <Divider sx={{ margin: "1rem 0rem" }}>
            <Chip label="View" size="small" />
          </Divider>

          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
              onClick={handleCardClick}
            >
              Card
            </Button>
            <Button
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
              onClick={handleTimelineClick}
            >
              Timeline
            </Button>
            <Button
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
              onClick={handleTabularClick}
            >
              Tabular
            </Button>
          </div>

          <Divider sx={{ margin: "1rem 0rem" }}>
            <Chip label="Additional Filter" size="small" />
          </Divider>

          <div>
            <FormControl fullWidth size="small">
              <InputLabel id="group-by-label">Group By</InputLabel>
              <Select
                labelId="group-by-label"
                id="group-by-select"
                value={groupBy}
                input={<OutlinedInput label="Group By" />}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <MenuItem value={"Task"}>Task</MenuItem>
                <MenuItem value={"Asset"}>Asset</MenuItem>
                <MenuItem value={"User"}>User</MenuItem>
                <MenuItem value={"Tag"}>Tag</MenuItem>
              </Select>
            </FormControl>
            <br />
            <br />

            <FormControl fullWidth size="small">
              <InputLabel id="logbook-label">Select Logbook</InputLabel>
              <Select
                labelId="logbook-label"
                id="logbook-select"
                multiple
                value={selectedLogbook}
                onChange={handleSelectLogbookChange}
                input={<OutlinedInput label="Select Logbook" />}
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem>
                  <Checkbox
                    checked={selectAllLogbook}
                    onChange={handleSelectAllLogbookChange}
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {logbooks.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedLogbook.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <br />
            <br />
            <FormControl fullWidth size="small">
              <InputLabel id="asset-label">Select Asset</InputLabel>
              <Select
                labelId="asset-label"
                id="asset-select"
                multiple
                value={selectedAsset}
                onChange={handleSelectAssetChange}
                input={<OutlinedInput label="Select Asset" />}
                renderValue={(selected) => selected.join(", ")}
              >
                <MenuItem>
                  <Checkbox
                    checked={selectAllAsset}
                    onChange={handleSelectAllAssetChange}
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {assets.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedAsset.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <br />
            <Button
              size="small"
              label="Submit"
              style={{ padding: "0.5rem 0.7rem", fontSize: "0.8rem" }}
              icon={
                <FontAwesomeIcon
                  style={{ marginRight: "0.2rem" }}
                  icon={faFilter}
                />
              }
              onClick={handleSubmit}
            />
          </div>
        </div>
      </Sidebar>
      {/* <div >
        <Button
          icon="pi pi-search"
          rounded
          text
          raised
          severity="success"
          aria-label="Search"
          onClick={() => {
            setVisible(true);
          }}
        />
      </div> */}
      {/* <div>
        <Fab
          sx={{ position: "fixed", left: "90%", top: "0.5%", zIndex: "950910" }}
          onClick={() => {
            console.log("visible ", visible);
            setVisible(true);
          }}
        >
          <Button
            icon="pi pi-search"
            rounded
            severity="success"
            aria-label="Search"
          />
        </Fab>
      </div> */}
      <Container maxWidth={containerSize} sx={{ padding: "0 !important" }}>
        {loading ? ( // Conditionally render ProgressSpinner if loading is true
          <div className="spinner-container">
            <ProgressSpinner style={{ width: "175px", height: "175px" }} />
          </div>
        ) : (
          <>
            {isTabularClick && (
              <>
                {taskOrTagData && (
                  <div>
                    <ManufacturingTablesContainer
                      manufacturingData={taskOrTagData}
                      groupBy={groupBy}
                    />
                  </div>
                )}
                {assetOrUserData && (
                  <div>
                    <ManufacturingTablesContainer
                      manufacturingData={assetOrUserData}
                      groupBy={groupBy}
                    />
                  </div>
                )}
              </>
            )}
            {isCardClick && (
              <>
                {cardData && (
                  <div>
                    <AssetOrUserTableContainer
                      jsonData={cardData}
                    ></AssetOrUserTableContainer>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
