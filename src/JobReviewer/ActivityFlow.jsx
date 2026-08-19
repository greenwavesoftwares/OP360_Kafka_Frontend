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
import { Button as PrimeReactButton } from "primereact/button"; // Button component from PrimeReact, renamed to PrimeReactButton
import {
  Tooltip as MuiTooltip, // Tooltip component from Material-UI, renamed to MuiTooltip
  
} from "@mui/material";

import { getActivityConnections } from "../Task/TaskAPI";
import CustomNode from "../Task/CustomNode";
import "./JobReviewer.css"
export default function ActivityFlow({ job }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  useEffect(() => {
    fetchActivities();
  }, []);
  const fetchActivities = async () => {
    const activityconnections = await getActivityConnections(job.task.taskId);
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
              ) : 
              activity.actvityStatus === "Started" ? (
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
              ) : (
                ""
              )}
            </div>
          </div>
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
      console.log("Edge data:", JSON.stringify(linksData));
      console.log("Node data:", JSON.stringify(nodesData));
    }
  };
  return (
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
        {console.log("Rendering ReactFlow")}
      </ReactFlow>
    </div>
  );
}
