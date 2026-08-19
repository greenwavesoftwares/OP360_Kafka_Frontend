import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  reconnectEdge,
  addEdge,
  Background,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

const ActivityFlow = ({ nodeId, nodeName }) => {
  const initialNodes = [];
  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reconnectDone = useRef(true);

  const calculateNodeSequences = (nodes, edges) => {
    const nodeLevels = {};
    const queue = [];

    // Find all root nodes (nodes with no incoming edges)
    nodes.forEach((node) => {
      const hasIncomingEdges = edges.some((edge) => edge.target === node.id);
      if (!hasIncomingEdges) {
        nodeLevels[node.id] = 1;
        queue.push(node.id);
      }
    });

    // Perform BFS to assign levels
    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentLevel = nodeLevels[currentNodeId];

      edges.forEach((edge) => {
        if (edge.source === currentNodeId) {
          nodeLevels[edge.target] = currentLevel + 1;
          queue.push(edge.target);
        }
      });
    }

    // Update nodes with their sequence levels
    const newNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        sequence: nodeLevels[node.id] || "",
      },
    }));

    return newNodes;
  };
  useEffect(() => {
    console.log("Node Deatils : ", nodes);
  }, [nodes]);
  useEffect(() => {
    console.log("Edge Details : ", edges);
  }, [edges]);
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      const newEdge = {
        ...params,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };
      const newEdges = addEdge(newEdge, edges);
      setEdges(newEdges);
      setNodes((nds) => calculateNodeSequences(nds, newEdges));
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onReconnectStart = useCallback(() => {
    reconnectDone.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      reconnectDone.current = true;
      const sourceNode = nodes.find((node) => node.id === newConnection.source);
      const targetNode = nodes.find((node) => node.id === newConnection.target);
      const newEdge = {
        ...newConnection,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };
      const newEdges = reconnectEdge(oldEdge, newEdge, edges);
      setEdges(newEdges);
      setNodes((nds) => calculateNodeSequences(nds, newEdges));
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!reconnectDone.current) {
        const newEdges = edges.filter((e) => e.id !== edge.id);
        setEdges(newEdges);
        setNodes((nds) => calculateNodeSequences(nds, newEdges));
      }
      reconnectDone.current = true;
    },
    [edges, setEdges, setNodes]
  );
  useCallback(() => {
    if (nodeName.trim() && nodeId.trim()) {
      const newNode = {
        id: nodeId,
        data: { label: nodeName, sequence: 1 },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  }, [nodeName, nodeId, nodes, setNodes]);

  return (
    <ReactFlow
      style={{
        display: "flex",
        flexDirection: "column",
        border: "shaded",
        backgroundColor: "#F8F8F8",
        height: "65vh",
      }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      snapToGrid
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      onConnect={onConnect}
      fitView
      attributionPosition="top-right"
    >
      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default ActivityFlow;
