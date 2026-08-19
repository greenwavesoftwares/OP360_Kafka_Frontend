import { Grid, Paper, styled } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { Dialog } from "primereact/dialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Handle,
  Position,
  useOnSelectionChange,
} from "reactflow";

export default function ActivityDetails(props) {
  const [activities, setActivities] = useState([]);
  const [componentSaved, setComponentSaved] = useState(false);
  const op = useRef(null);
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);

  useEffect(() => {
    // setActivities(props.task ? props.task.activityList : "");

    console.log(props);
  }, []);

  const {
    task,
    activityNodePositions,
    activityConnections,
    setActivityConnections,
    nextButtonClicked,
    setNextButtonClicked,
    addConnections,
    saveNodePositions,
    setNodePositionChanged,
    setNodePositionSaved,
    setActivityNodePositions,
    setNodeDataCreated,
    nodeDataCreated,
    taskUpdated,
    nodesDraggable,
    selectedActivity,
    setSelectedActivity,
    activitySelected,
    setActivitySelected,
    activityUpdated,
    setActivityUpdated,
    edgesUpdatable,
    connections,
    setConnections,
  } = props;

  console.log(task);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  //==================CREATING NODES AND EDGES OUT OF ACTIVITIES=======================//

  useEffect(() => {
    if (task && task.activityList) {
      console.log("My Activity ", task.activityList);
      const initialNodes = task.activityList
        ? task.activityList.map((activity) => {
            if (activity) {
              return {
                id: activity.activityId,
                position: {
                  x: Number(activity.xPos),
                  y: Number(activity.yPos),
                },
                data: {
                  label:
                    activity.activityName + "(" + activity.duration + "mins)",
                },
              };
            } else return null;
          })
        : "";

      console.log(initialNodes);

      setNodes(initialNodes);
    }

    console.log(activityConnections);

    const edges =
      activityConnections && activityConnections.length
        ? activityConnections.map((activityConnection) => {
            return {
              id:
                "e" +
                activityConnection.sourceId +
                "-" +
                activityConnection.targetId,
              source: activityConnection.sourceId,
              target: activityConnection.targetId,
            };
          })
        : [];

    if (edges && edges.length) {
      setEdges(edges);
    }

    console.log(edges);
  }, [task]);

  //===================ADDING NODE POSITIONS AND CONNECTIONS================//

  useEffect(
    () => {
      let edgesData = [];

      console.log(edges);

      if (edges) {
        edgesData = edges.map((edge) => {
          let source = [];
          let target = [];

          if (task && task.activityList) {
            source = task.activityList.filter(
              (activity) => activity.activityId === edge.source
            );

            if (source && source.length) source = source[0];
          }

          target = task.activityList.filter(
            (activity) => activity.activityId === edge.target
          );

          if (target && target.length) target = target[0];

          return {
            taskId: task.taskId,
            source: source.activityAbrv,
            sourceId: edge.source,
            target: target.activityAbrv,
            targetId: edge.target,
          };
        });

        console.log(edgesData);

        // if(edgesData){

        //   let sourceList = edgesData.map(edgesData => edgesData.source);

        //   let targetList = edgesData.map(edgesData => edgesData.target);

        //   let activityIdList = [];

        //   if(task && task.activityList) {

        //       task.activityList.forEach(activity => {

        //           if((task.activityList.length > 1) && !sourceList.includes(activity) && !targetList.includes(activity)){

        //             alert('all activities should be connected');

        //             return;
        //           }

        //       });

        //   }

        // }

        // if (typeof addConnections === "function" && edgesData.length) {
        //   addConnections(edgesData);
        // }
      }

      let nodesData = [];

      if (nodes) {
        nodes.forEach((node) => {
          nodesData.push({
            taskId: task.taskId,
            activityId: node.id,
            posX: node.position.x,
            posY: node.position.y,
          });
        });

        console.log(nodesData);

        if (typeof setActivityNodePositions === "function")
          setActivityNodePositions(nodesData);

        // if (typeof setNodeDataCreated === "function")
        // setNodeDataCreated(!nodeDataCreated);
      }
    },
    //  [nextButtonClicked,nodes]
    [nextButtonClicked]
  );

  //     useEffect(() => {

  //       let edgesData = [];

  //     console.log(edges);

  //     if (edges) {
  //       edgesData = edges.map((edge) => {
  //         let source = [];
  //         let target = [];

  //         if (task && task.activityList) {
  //           source = task.activityList.filter(
  //             (activity) => activity.activityId === edge.source
  //           );

  //           if (source && source.length) source = source[0];
  //         }

  //         target = task.activityList.filter(
  //           (activity) => activity.activityId === edge.target
  //         );

  //         if (target && target.length) target = target[0];

  //         return {
  //           taskId: task.taskId,
  //           source: source.activityAbrv,
  //           sourceId: edge.source,
  //           target: target.activityAbrv,
  //           targetId: edge.target,
  //         };
  //       });

  //       console.log(edgesData);

  //         if (edgesData && edgesData.length) {
  //         addConnections(edgesData);
  //       }

  // }
  //     },[edges]);

  // useEffect(() => {
  //   console.log(activityNodePositions);
  // }, [activityNodePositions]);

  useEffect(() => {
    if (typeof setNodePositionSaved === "function") setNodePositionSaved(true);
  }, [componentSaved]);

  const onConnect = useCallback(
    (params) => {
      if (params && params.source === params.target) {
        alert("activity cannot connect with itself");

        return;
      }

      setEdges((eds) => addEdge(params, eds));

      console.log(params);
    },
    [setEdges]
  );

  const onNodeDragStop = () => {
    let nodesData = [];

    if (nodes) {
      nodesData = nodes.map((node) => {
        return {
          taskId: task.taskId,
          activityId: node.id,
          posX: node.position.x,
          posY: node.position.y,
        };
      });

      console.log(nodesData);

      if (typeof setActivityNodePositions === "function")
        setActivityNodePositions(nodesData);

      setNodeDataCreated();

      // saveNodePositions(nodesData);
    }
  };

  console.log(edges);
  console.log(nodes);

  useEffect(
    () => {
      if (typeof setNodePositionChanged === "function")
        setNodePositionChanged(true);
    },
    // []
    [nodes]
  );

  const createAddNodesAndEdges = () => {
    let nodesData = [];

    if (nodes) {
      nodes.forEach((node) => {
        nodesData.push({
          taskId: task.taskId,
          activityId: node.id,
          posX: node.position.x,
          posY: node.position.y,
        });
      });

      console.log(nodesData);

      if (typeof setActivityNodePositions === "function")
        setActivityNodePositions(nodesData);

      if (typeof setNodeDataCreated === "function")
        setNodeDataCreated(!nodeDataCreated);
    }

    console.log(edges);

    let edgesData = [];

    console.log(edges);

    if (edges) {
      edgesData = edges.map((edge) => {
        let source = [];
        let target = [];

        if (task && task.activityList) {
          source = task.activityList.filter(
            (activity) => activity.activityId === edge.source
          );

          if (source && source.length) source = source[0];
        }

        target = task.activityList.filter(
          (activity) => activity.activityId === edge.target
        );

        if (target && target.length) target = target[0];

        return {
          taskId: task.taskId,
          source: source.activityAbrv,
          sourceId: edge.source,
          target: target.activityAbrv,
          targetId: edge.target,
        };
      });

      if (edgesData) {
        edgesData.forEach((edge) => {
          if (!edge.source || !edge.target) {
            let index = edgesData.indexOf(edge);

            edgesData.splice(index, 1);
          }

          if (edge.sourceId === edge.targetId) {
            alert("activity cannot connect with itself");

            let index = edgesData.indexOf(edge);

            edgesData.splice(index, 1);
          }
        });
      }

      console.log(edgesData);

      if (edgesData && edgesData.length) {
        // addConnections(edgesData);
      }

      if (typeof setActivityConnections === "function")
        setActivityConnections(edgesData);
    }
  };

  // const Item = styled(Paper)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  //   ...theme.typography.body2,
  //   padding: theme.spacing(1),
  //   textAlign: "center",
  //   color: theme.palette.text.secondary,
  // }));

  // useEffect(() => {
  //   if (typeof createAddNodesAndEdges === "function") createAddNodesAndEdges();
  // }, [activityUpdated]);

  useEffect(
    () => {
      let edgesData = [];

      console.log(edges);

      if (edges) {
        edgesData = edges.map((edge) => {
          let source = [];

          let target = [];

          if (task && task.activityList) {
            source = task.activityList.filter(
              (activity) => activity.activityId === edge.source
            );

            if (source && source.length) source = source[0];

            target = task.activityList.filter(
              (activity) => activity.activityId === edge.target
            );

            if (target && target.length) target = target[0];
          }

          return {
            taskId: task.taskId,
            source: source.activityAbrv,
            sourceId: edge.source,
            target: target.activityAbrv,
            targetId: edge.target,
          };
        });

        console.log(edgesData);

        if (typeof setActivityConnections === "function")
          setActivityConnections(edgesData);
      }

      // if(edges && edges.length && typeof addConnections === "function")
      // addConnections(edgesData);
    },
    // []
    [edges]
  );

  //   useEffect(() => {

  //     if (typeof setConnections === "function")
  //     setConnections(edges);

  //   },
  //   // []
  //   [edges]
  // );

  return (
    <>
      {/* {console.log(task.activityList)} */}

      <div
        style={{
          width: "100%",
          height: "100%",

          background: "#f7f7f7",
          borderRadius: "0.6rem",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodesDraggable={nodesDraggable}
          edgesUpdatable={edgesUpdatable}
          fitView
          onNodeClick={(e, node) => {
            console.log("=================", node);

            if (task && task.activityList) {
              task.activityList.forEach((activity) => {
                if (activity.activityId === node.id) {
                  setSelectedActivity(activity);

                  setActivitySelected(true);

                  // setResetForm(false);
                  console.log(activity);
                }
              });
            }
          }}
        >
          {console.log(selectedActivity ? selectedActivity.activityName : "")}
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  );
}
