import { Dialog } from "primereact/dialog";
import AssetTree from "../components/shared/tree/AssetTree.component";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card, Divider, Grid, Paper, Typography } from "@mui/material";

export default function AssetDialog(props) {
  const toast = useRef(null);
  // const [selectedAssets,setSelectedAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState({});
  // const [count,setCount] = useState(0);
  const [extraAssets, setExtraAssets] = useState([]);

  let {
    onHide,
    treeData,
    logbooks,
    setLogbooks,
    selectedLogbook,
    setSelectedLogbook,
    setSelectedNode,
    assetDialogVisible,
    selectedAssets,
    setSelectedAssets,
    setAssetDialogVisible,
    activityName,
    count,
    setCount,
    assetData,
    setAssetData,
    selectedActivity,
    groups,
    department,
  } = props;

  console.log("TREE DATA", treeData);

  console.log(selectedLogbook);

  console.log(assetData);

  console.log(logbooks);

  if (logbooks.includes(null))
    logbooks = logbooks.filter((logbook) => logbook != null);

  useEffect(() => {
    console.log(selectedLogbook);

    //=============UNUSED CODE==============//
    if (selectedLogbook) {
      setCount(count + 1);
      // alert('logbook already selected');
    }
    //======================================//

    console.log(count);

    console.log(selectedAssets);

    if (selectedAssets === null) setSelectedAssets([]);

    if (groups && groups.includes(",")) {
      let groupsList = groups.split(",");

      let group = "";

      for (let i = 0; i < groupsList.length; i++) {
        if (i === groupsList.length - 1) group += groupsList[i];
        else group += groupsList[i] + ",";
      }
    }
  }, []);

  useEffect(() => {
    setSelectedLogbook(selectedActivity ? selectedActivity.logbook : "");

    if (selectedActivity && selectedActivity.logbook) setCount(1);
  }, [selectedActivity]);

  const logbookDropdoenHandler = (event) => {
    if (count === 0 || !selectedLogbook) {
      setSelectedLogbook(event.target.value);
      setCount(count + 1);
    } else {
      if (selectedLogbook === event.target.value) {
        setSelectedLogbook(event.target.value);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Selected logbook : " + selectedLogbook,
          detail: "Logbook must be same for all assets",
          life: 3000,
        });
      }
    }

    console.log(
      "Prev Selected logbook",
      typeof selectedLogbook,
      "DropDown Select",
      event.target.value
    );
  };

  useEffect(() => {
    if (typeof setLogbooks === "function") setLogbooks([]);

    if (selectedAssets) {
      //  console.log('Entered while selecting a node ! ')
      if (typeof setAssetData === "function")
        setAssetData(
          selectedAssets.map((asset) => {
            return {
              assetName: asset.assetName,
              assetId: asset.id,
              logbook: selectedLogbook,
              groups: groups,
              department: department,
            };
          })
        );
    }
  }, [selectedAssets]);

  console.log(assetData);

  return (
    <Dialog
      header={`Activity : ${activityName}`}
      onHide={onHide}
      visible={assetDialogVisible}
      style={{ width: "50rem", height: "50rem" }}
    >
      <Toast ref={toast} />
      <Divider />

      <Grid container sx={{ mt: 1 }} spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: "0.8rem" }}>
            <Typography>Select an Asset</Typography>
            <AssetTree
              data={treeData}
              setSelectedNodeFn={(node) => {
                console.log("selected node", node);

                if (typeof setLogbooks === "function") setLogbooks([]);

                setSelectedNode(null);
                setSelectedNode(node);

                setSelectedAsset(node);

                // Resetting the selected logbooks every time a new asset is selected
                // setSelectedLogbook('');
              }}
            />
            <AssetTree></AssetTree>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: "0.8rem" }}>
            <Typography>Select Logbook</Typography>
            <Dropdown
              options={
                logbooks && logbooks.length ? logbooks : ["no logbooks found"]
              }
              name="Select Logbooks"
              // optionLabel="lookbookname"
              value={selectedLogbook}
              onChange={(e) => {
                logbookDropdoenHandler(e);
              }}
              placeholder="Select Logbooks"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* <h3>Type of Asset</h3> */}

      {/* <Dropdown
              value={assetGroup}
              placeholder="Select reviewer"
              options={props.assetGroup ? props.assetGroup : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            /> */}

      {/* <h3>Logbook</h3>
            <Dropdown
              value={assetGroup}
              placeholder="Select Logbook"
              options={logbooks ? props.logbooks : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            />  */}

      {/* <h2 style={{textAlign : 'center',}}>Activity : <i>{activityName}</i></h2> */}

      {/* <div>
        <h3>Select an Asset</h3>
        <AssetTree
          data={treeData}
          setSelectedNodeFn={(node) => {
            console.log("selected node", node);
            setSelectedNode(node);

            setSelectedAsset(node);

            // Resetting the selected logbooks every time a new asset is selected
            // setSelectedLogbook('');
          }}
        />
      </div> */}

      {/* <div>
        <h3>Select Logbook</h3>
        <Dropdown
          options={logbooks}
          name="Select Logbooks"
          optionLabel="lookbookname"
          value={selectedLogbook}
          onChange={(e) => {
            logbookDropdoenHandler(e);
          }}
          placeholder="Select Logbooks"
        />
      </div> */}
      <br />
      <Button
        type="button"
        label="Add asset"
        size="small"
        rounded
        icon="pi pi-plus"
        disabled={Object.keys(selectedAsset).length === 0}
        onClick={() => {
          // setAssetDialogVisible(false);

          console.log(selectedAsset);

          console.log(selectedLogbook);

          if (
            count !== 0 &&
            Object.keys(selectedLogbook).length !== 0 &&
            logbooks
          ) {
            let logbookNames = logbooks;
            // logbooks.map((logbook) => logbook.lookbookname);

            if (!logbookNames.includes(selectedLogbook)) {
              toast.current.show({
                severity: "info",
                summary: "Info",
                detail: "Please select a logbook",
                life: 3000,
              });

              return;
            }
          }

          if (selectedAssets)
            setSelectedAssets(
              selectedAssets.concat({
                assetName: selectedAsset.assetName,
                assetId: selectedAsset.id,
                lookbookname: selectedLogbook,
              })
            );

          setExtraAssets(
            extraAssets.concat({
              assetName: selectedAsset.assetName,
              lookbookname: selectedLogbook,
            })
          );

          setCount(count + 1);
        }}
        //style={{ position: "relative", top: "3rem", left: "7rem" }}
      />

      {/* {!selectedActivity && ( */}
      <Button
        type="button"
        label="Reset Form"
        size="small"
        outlined
        rounded
        icon="pi pi-refresh"
        style={{ marginLeft: "1rem" }}
        severity="warning"
        onClick={() => {
          if (selectedActivity) {
            if (
              selectedActivity.assetNameList.length === 1 &&
              selectedActivity.assetNameList[0] === ""
            ) {
              setAssetData([]);
            } else {
              setAssetData(
                selectedActivity.assetNameList.map((assetName) => {
                  return {
                    assetName: assetName,
                    logbook: selectedActivity.logbook,
                  };
                })
              );

              console.log(selectedActivity);

              setSelectedLogbook(
                selectedActivity
                  ? { lookbookname: selectedActivity.logbook }
                  : ""
              );

              // setSelectedAssets([]);

              setCount(1);

              setAssetData(
                selectedActivity && selectedActivity.assetNameList
                  ? selectedActivity.assetNameList.map((assetName) => {
                      return {
                        assetName: assetName,
                        lookbookname: selectedActivity.logbook,
                      };
                    })
                  : ""
              );
            }

            setSelectedAssets();
          } else {
            setSelectedAssets([]);

            setSelectedLogbook("");

            setCount(0);

            setAssetData([]);
          }

          toast.current.show({
            severity: "info",
            summary: "Info",
            detail: "Form Reset",
            life: 3000,
          });
        }}
        //style={{ position: "relative", top: "3rem", left: "25rem" }}
      />

      {console.log("AssetData", assetData)}

      <DataTable
        value={assetData}
        style={{ top: "1rem", fontSize: "0.8rem", border: "1px solid #dfdddd" }}
      >
        <Column field="assetName" header="Asset Name" />
        <Column field="logbook" header="Logbook" />
        <Column field="groups" header="Groups" />
        <Column field="department" header="Department" />
        <Column
          header="Delete"
          body={(rowData) => (
            <Button
              type="button"
              //label="Delete asset"
              size="small"
              severity="danger"
              //outlined
              rounded
              icon="pi pi-trash"
              onClick={(index) => {
                const fildata = assetData.filter(
                  (asset) => asset.assetName !== rowData.assetName
                );

                setAssetData(fildata);

                if (fildata)
                  setSelectedAssets(
                    fildata.map((asset) => {
                      return {
                        assetName: asset.assetName,
                        lookbookname: selectedLogbook,
                        assetId: asset.id,
                      };
                    })
                  );

                if (fildata && fildata.length === 0) {
                  // alert('no assets for this activity, resetting logbook');

                  if (toast && toast.current)
                    toast.current.show({
                      severity: "info",
                      summary: "Info",
                      detail: "No assets for this activity, resetting logbook",
                      life: 3000,
                    });

                  setCount(0);

                  setSelectedLogbook("");
                }
              }}
            />
          )}
        ></Column>
      </DataTable>

      {console.log("ASSETS", selectedAssets)}
      {console.log("selected logbook", selectedLogbook)}
      {console.log("selected asset", selectedAsset)}
      {console.log("logbooks", logbooks)}
      {console.log("count", count)}
      {console.log("Extra assets", extraAssets)}
    </Dialog>
  );
}
