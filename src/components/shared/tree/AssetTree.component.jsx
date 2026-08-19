
// import { SimpleTreeView }  from '@mui/x-tree-view/SimpleTreeView';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";

const AssetTree = (props) => {
  
  console.log("test",props.data);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.label} 
      onClick={() => handleNodeClick(nodes)}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const handleNodeClick = (node) => {
    props.setSelectedNodeFn(node);
  };

  return (
    <div>
      <TreeView
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          transition: "box-shadow 0.3s ease-in-out",
        
            [`& .${treeItemClasses.group}`]: {
              borderLeft: "1px dashed rgba(0, 0, 0, 0.4)",
            },
            [`& .${treeItemClasses.iconContainer}`]: {
              borderRadius: "50%",
              padding: "0px 9.6px",
              //borderLeft: "1px dashed rgba(0, 0, 0, 0.4)",
              background: "rgba(25, 118, 210, 0.25)",
            },
          }}
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon/>}
      >
        {renderTree(props.data, props.setSelectedNodeFn)}
      </TreeView>
    </div>
  );
};

export default AssetTree;
