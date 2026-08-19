import { useCallback, useEffect, useMemo } from "react";
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
import { useTheme, Tooltip as MuiTooltip, Badge, Tooltip } from "@mui/material";
import { Hourglass } from "react-loader-spinner";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import  "../JobReviewer/JobReviewer.css"

export default function ActivityFlowForUpcomingActivities({
  job,
  setJob,
  showDialog,
  setShowDialog,
  groupDetails,
  currentSequence,
  performer,
}) {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  // Get the user ID from session storage

  const checkActivityPerformer = (activity) => {
    if (
      activity.performer === performer ||
      groupDetails.some(
        (group) =>
          activity.groupOrDeptName?.toLowerCase().trim() ===
          group.groupName?.toLowerCase().trim(),
      )
    ) {
      return true;
    } else {
      return false;
    }
  };
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    [],
  );
  const fetchActivities = async () => {
    const activityconnections = await getActivityConnections(job?.task?.taskId);
    const nodesData = job?.task?.activityList?.map((activity) => ({
      id: activity.activityId, // Assign activityId to node ID.
      type: "customNode",
      data: {
        label: (
          <>
            <Tooltip className="tooltip" 
              title={
                <>
                  {activity.performer && <>Performer: {activity.performer}</>}
                  {activity.groupOrDeptName && (
                    <>Performer Group: {activity.groupOrDeptName}</>
                  )}
                  <br />
                  Approver: {activity.approver}
                </>
              }
            >
              {activity.performer && (
                <PersonIcon
                  style={{
                    height: "0.5rem",
                    color: checkActivityPerformer(activity) ? "green" : "red",
                  }}
                />
              )}
              {activity.groupOrDeptName && (
                <GroupIcon
                  style={{
                    height: "0.5rem",
                    color: checkActivityPerformer(activity) ? "green" : "red",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  columnGap: "0.2rem",
                  // backgroundColor:activity.sequence>currentSequence?'#e0930dff':'white'
                }}
              >
                {activity.activityName}
                <div>
                  {activity.actvityStatus === "Completed" ? (
                    <MuiTooltip className="tooltip"  title="Completed" placement="right">
                      <i
                        className="pi pi-check"
                        style={{
                          fontSize: "0.45rem",
                          color: "blue",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : // {/* Display  the status using tooltip*/}
                  activity.actvityStatus === "Rejected" ? (
                    <MuiTooltip className="tooltip"  title="Rejected" placement="right">
                      <i
                        className="pi pi-times"
                        style={{
                          fontSize: "0.45rem",
                          color: "red",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Aborted" ? (
                    <MuiTooltip className="tooltip"  title="Aborted" placement="right">
                      <i
                        className="pi pi-ban"
                        style={{
                          fontSize: "0.45rem",
                          color: "red",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Sent For Approval" ? (
                    <MuiTooltip className="tooltip"  title="Sent For Approval" placement="right">
                      <i
                        className="pi pi-send"
                        style={{
                          fontSize: "0.45rem",
                          color: "green",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Started" ? (
                    <MuiTooltip className="tooltip"  title="Started" placement="right">
                      <i
                        className="pi pi-play"
                        style={{
                          fontSize: "0.45rem",
                          color: "blue",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Review Started" ? (
                    <MuiTooltip className="tooltip"  title="Review Started" placement="right">
                      <i
                        className="pi pi-file-check"
                        style={{
                          fontSize: "0.45rem",
                          color: "#E9762B",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Not Started" ? (
                    <MuiTooltip className="tooltip"  title="Not Started" placement="right">
                      <i
                        className="pi pi-stopwatch"
                        style={{
                          fontSize: "0.45rem",
                          color: "#06b6d4",
                          background: "#F5F5F5",
                          borderRadius: "50%",
                          padding: "0.2rem",
                        }}
                      ></i>
                    </MuiTooltip>
                  ) : activity.actvityStatus === "Not Started" &&
                    activity.sequence > currentSequence &&
                    checkActivityPerformer(activity) ? (
                    <MuiTooltip className="tooltip"  title="Upcoming Activity" placement="right">
                      <Hourglass
                        visible={true}
                        height="15"
                        width="15"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={["#cec930ff", "#b0e82cff"]}
                      />
                    </MuiTooltip>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Tooltip>
          </>
        ),
        sequence: activity.sequence,
      }, // Set node label and sequence from activity data.
      position: { x: Number(activity.xPos), y: Number(activity.yPos) }, // Set node position based on activity's xPos and yPos.
    }));

    setNodes(nodesData); // Set nodes with generated nodesData.
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
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Dialog
      visible={showDialog}
      header={
        <div>
          The activity flow for{" "}
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
          >
            <MiniMap />
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      )}
    </Dialog>
  );
}
