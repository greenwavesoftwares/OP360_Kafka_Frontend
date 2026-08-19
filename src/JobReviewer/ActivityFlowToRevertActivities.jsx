import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { // Importing ReactFlow for visualizing flow diagrams with nodes and edges.
  Background, // Importing Background component from ReactFlow for grid or background visuals.
  Controls, // Importing Controls component from ReactFlow for zoom and pan controls.
  MiniMap, // Importing MiniMap component from ReactFlow to provide an overview of the flow chart.
  addEdge, // Importing addEdge function from ReactFlow to add edges between nodes.
  reconnectEdge, // Importing reconnectEdge function from ReactFlow to reconnect existing edges.
  useEdgesState, // Importing useEdgesState hook from ReactFlow to manage edge state.
  useNodesState, // Importing useNodesState hook from ReactFlow to manage node state.
} from "reactflow"; // Importing all necessary components from the ReactFlow library.

import { getActivityConnections } from "../Task/TaskAPI";
import CustomNode from "../Task/CustomNode";
import { Dialog } from "primereact/dialog";
import { useMediaQuery } from "react-haiku";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import CustomDialog from "../components/shared/confirmationDialog/dialog.component";
import InfoIcon from "@mui/icons-material/Info"; // Icon for information
import { fetchJobDetails, updateSequentialStatus } from "./JobReviewerAPI";
import HistoryIcon from "@mui/icons-material/History";
import UndoIcon from "@mui/icons-material/Undo";
import { updateJobAndActivity } from "../JobPerformer/JobPerformerAPI";
export default function ActivityFlowToRevertActivities({
  job,
  setJob,
  showDialog,
  setShowDialog,
  setSnackbarContent,
  setOpenSnackbar,
}) {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [renderData, setRenderData] = useState(false);
  const [revertType,setRevertType]=useState(null)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [showSnackbar, setSnackbar] = useState(false);
  
  // useEffect(()=>{
  //   fetchData()
  // },[renderData])
  // const fetchData=async()=>{
  //   const jobDetails=await fetchJobDetails(job?.jobID)
  //   setJob(jobDetails)
  //   console.log("Job Details:",job)
  // }
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    [],
  );
  const handleRevertClick = ( node,type) => {
    setRevertType(type)
    console.log("Clicked node", node);
    setSelectedNode(node);
    setConfirmationDialog(true);
  };
  const revertActivity = async () => {
    try {
      selectedNode.actvityStatus = "Not Started";
      selectedNode.actualActivityStartTime = "";
      selectedNode.actualActivityEndTime = "";
      const jobToUpdate = structuredClone(job);
      jobToUpdate.task.activityList = [selectedNode];
      console.log("Job to update:",jobToUpdate)
      const response = await updateJobAndActivity(jobToUpdate);
      setSnackbarContent({
        dialog: "Update Successful",
        severity: "success",
      });
      setOpenSnackbar(true);
      setConfirmationDialog(false);
      setRenderData(!renderData);
      setJob(null);
      setShowDialog(false);
    } catch (e) {
      console.error("Error in update sequence");
      setSnackbarContent({
        dialog: "Error",
        severity: "error",
      });
    }
  };
  const revertSequence = async () => {
    try {
      await updateSequentialStatus(
        job.jobID,
        selectedNode.activityId,
        selectedNode.sequence,
      );
      setSnackbarContent({
        dialog: "Update Successful",
        severity: "success",
      });
      setOpenSnackbar(true);
      setConfirmationDialog(false);
      setRenderData(!renderData);
      setJob(null);
      setShowDialog(false);
    } catch (e) {
      console.error("Error in update sequence");
      setSnackbarContent({
        dialog: "Error",
        severity: "error",
      });
    }
  };

  const fetchActivities = async () => {
    const activityconnections = await getActivityConnections(job?.task?.taskId);
    const nodesData = job?.task?.activityList?.map((activity) => ({
      id: activity.activityId, // Assign activityId to node ID.
      type: "customNode",
      data: {
        label: (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              columnGap: "0.2rem",
            }}
          >
            {activity.activityName}

            <div style={{ display: "flex", flexDirection: "row" }}>
              <Tooltip title="Revert the particular activity">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setRevertType(2)
                     handleRevertClick(activity,2)
                  }}
                  sx={{
                    padding: "2px",
                    width: "22px",
                    height: "22px",
                    backgroundColor: "#F3E5F5", // light purple
                    "&:hover": {
                      backgroundColor: "#CE93D8", // darker purple
                    },
                  }}
                >
                  <UndoIcon
                    style={{
                      fontSize: "1rem",
                      color: "blue",
                      background: "",
                      padding: "0.2rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Revert to the particular sequence">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setRevertType(1)
                    handleRevertClick(activity,1)
                  }}
                  sx={{
                    fontSize: "0.2rem",
                    backgroundColor: "#E3F2FD", // light blue
                    "&:hover": {
                      backgroundColor: "#90CAF9", // darker blue
                    },
                    padding: "2px",
                    width: "22px",
                    height: "22px",
                  }}
                >
                  <HistoryIcon
                    style={{
                      fontSize: "1rem",
                      color: "blue",
                      background: "#F5F5F5",
                      borderRadius: "50%",
                      padding: "0.2rem",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ),
        sequence: activity.sequence,
        activityName: activity.activityName,
        activityId: activity.activityId,
      }, // Set node label and sequence from activity data.
      position: { x: Number(activity.xPos), y: Number(activity.yPos) }, // Set node position based on activity's xPos and yPos.
    }));

    setNodes(nodesData); // Set nodes with generated nodesData.
    console.log("Nodes data:", nodesData);
    if (activityconnections?.length > 0) {
      // If there are activity connections available.
      const linksData = activityconnections.map((connection) => ({
        id: connection.sourceId + connection.targetId, // Create a unique ID for the edge.
        source: connection.sourceId, // Set the source ID for the connection.
        target: connection.targetId, // Set the target ID for the connection.
        animated: true, // Enable animation for the connection (edge).
        data: {
          sourceName: connection.source, // Set source name for the connection.
          targetName: connection.target, // Set target name for the connection.
        },
      }));

      setEdges(linksData); // Set edges with generated linksData.
      console.log("Edge data:", JSON.stringify(linksData));
      console.log("Node data:", JSON.stringify(nodesData));
    }
  };
  
  useEffect(() => {
    console.log("Useeffect inside react flow");
    fetchActivities();
  }, []);

  return (
    <>
      <Dialog
        visible={showDialog}
        header={
          <div style={{ display: "flex", flexDirection: "row" }}>
            
            Revert for {" "}
            <span style={{ color: "red" }}>{job.jobName} </span>
          </div>
        }
        onHide={() => {
          setShowDialog(false);
          setJob(null);
        }}
        style={{ width: isMobile || isTab ? "100%" : "80%", zIndex: "100" }}
      >
        {showDialog && (
          <div
            style={{
              background: "#F5F5F5",
              height: "30rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ReactFlow
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              attributionPosition="top-right"
              snapToGrid={true}
              nodesDraggable={false}
              edgesUpdatable={false}
              fitView
              // onNodeClick={handleNodeClick}
            >
              <MiniMap />
              <Background />
              <Controls />
              {console.log("Rendering ReactFlow")}
            </ReactFlow>
          </div>
        )}
      </Dialog>
      {showConfirmationDialog && (
        <CustomDialog
          open={showConfirmationDialog}
          setOpen={setConfirmationDialog}
           proceedButtonClick={async () => {
            if(revertType===1)
              revertSequence()
            else
              revertActivity()
             }}
          title={
            <>
              {revertType===1?'Are you sure you wish to revert the job to this particular activity':'Are you sure you wish to revert this activity'} (
              <span style={{ color: "red" }}>{selectedNode.activityName}</span>
              )?
            </>
          }
          cancelButtonText={"Cancel"}
          proceedButtonText={"Proceed"}
        />
      )}
    </>
  );
}
