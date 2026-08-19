import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  reconnectEdge,
  addEdge,
  Background,
  EdgeText,
} from "reactflow";
import "./reactflow.css";
import { TextField, Button, Box } from "@mui/material";
import CustomNode from "./CustomNode";

// Utility Functions
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

const hasCycle = (nodes, edges, newEdge) => {
  const { source, target } = newEdge;
  const graph = {};

  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  edges.forEach((edge) => {
    graph[edge.source].push(edge.target);
  });

  graph[source].push(target);

  const visited = new Set();
  const stack = new Set();

  const dfs = (node) => {
    if (!visited.has(node)) {
      visited.add(node);
      stack.add(node);

      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor) && dfs(neighbor)) {
          return true;
        } else if (stack.has(neighbor)) {
          return true;
        }
      }
    }

    stack.delete(node);
    return false;
  };

  return dfs(source);
};

const nodeTypes = {
  customNode: CustomNode,
};

const DeleteEdgeDrop = () => {
  const activityconnections = [];
  const acticityList = [];

  const nodesData = acticityList.map((activity) => ({
    id: activity.activityId,
    type: "customNode",
    data: { label: activity.activityName },
    position: { x: activity.xPos, y: activity.yPos },
  }));

  const linksData = activityconnections.map((connection) => ({
    id: connection.sourceId + connection.targetId,
    source: connection.sourceId,
    target: connection.targetId,
    animated: true,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(linksData);
  const reconnectDone = useRef(true);
  const [nodeName, setNodeName] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    console.log("Node Details : ", nodes);
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
        animated: true,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };

      if (hasCycle(nodes, edges, newEdge)) {
        console.log("Circuit present, edge not added");
        return;
      }

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
        animated: true,
        data: {
          sourceName: sourceNode?.data.label || "",
          targetName: targetNode?.data.label || "",
        },
      };

      if (hasCycle(nodes, edges, newEdge)) {
        console.log("Circuit present, edge not reconnected");
        return;
      }

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

  const addNode = useCallback(() => {
    if (nodeName.trim() && nodeId.trim()) {
      const newNode = {
        id: nodeId,
        type: "customNode",
        data: { label: nodeName, sequence: 1 },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeName("");
      setNodeId("");
    }
  }, [nodeName, nodeId, nodes, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setNodeName(node.data.label);
    setSelectedNodeId(node.id);
    console.log(`Node clicked: ${node.id}, Name: ${node.data.label}`);
  }, []);

  const updateNodeName = useCallback(() => {
    if (selectedNodeId) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, label: nodeName } }
            : node
        )
      );
    }
  }, [selectedNodeId, nodeName, setNodes]);

  const deleteNode = useCallback(() => {
    if (selectedNodeId) {
      const newNodes = nodes.filter((node) => node.id !== selectedNodeId);
      const newEdges = edges.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      );
      setNodes(newNodes);
      setEdges(newEdges);
      setSelectedNodeId(null);
      setNodeName("");
      setNodeId("");
    }
  }, [selectedNodeId, nodes, edges, setNodes, setEdges]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <TextField
          label="Enter node ID"
          value={nodeId}
          onChange={(e) => setNodeId(e.target.value)}
          variant="outlined"
        />
        <TextField
          label="Enter node name"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={addNode}>
          Add Node
        </Button>
        <Button variant="contained" color="secondary" onClick={updateNodeName}>
          Update Node Name
        </Button>
        <Button variant="contained" color="error" onClick={deleteNode}>
          Delete Node
        </Button>
      </Box>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        nodeTypes={nodeTypes}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="top-right"
        aria-disabled={true}
      >
        <svg>
          <defs>
            <EdgeText
              x={100}
              y={100}
              labelStyle={{ fill: "white" }}
              labelShowBg
              labelBgStyle={{ fill: "red" }}
              labelBgPadding={[2, 4]}
              labelBgBorderRadius={2}
            />
            <linearGradient id="edge-gradient">
              <stop offset="0%" stopColor="#0d8f23" />
              <stop offset="100%" stopColor="#2a8af6" />
            </linearGradient>

            <marker
              id="edge-circle"
              viewBox="-5 -5 10 10"
              refX="0"
              refY="0"
              markerUnits="strokeWidth"
              markerWidth="10"
              markerHeight="10"
              orient="auto"
            >
              <circle
                stroke="#2a8af6"
                strokeOpacity="0.75"
                r="2"
                cx="0"
                cy="0"
              />
            </marker>
          </defs>
        </svg>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default DeleteEdgeDrop;
