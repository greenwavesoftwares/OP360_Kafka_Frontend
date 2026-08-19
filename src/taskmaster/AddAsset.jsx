import { Dropdown } from "primereact/dropdown";
import AssetTree from "../components/shared/tree/AssetTree.component";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Tree } from "primereact/tree";

export default function AddAsset(props) {
  return (
    <div style={{width : '15rem',backGroundColor : 'red'}}>
      <span>
        <h3>Select Asset Group</h3>
      </span>

      <Dropdown
        value={props.assetGroup}
        options={props.assetGroups}
        optionLabel="groupName"
        placeholder="Select Asset group"
        onChange={(e) => {

          props.setAssetGroup(e.target.value);

          console.log(e.target.value.GroupId);

          if (e.target.value === "Default Asset Group") {
            //   <ConfirmPopup/>
            // DELETE ALL THE ACTIVITIES RELATED TO DEFAULT ASSET GROUP
          }
        }}
      />

        
      <AssetTree data={props.treeData} setSelectedNodeFn={(node) => {
              console.log("selected node",node) 
              props.setSelectedNode(node);

              }}/>

      {console.log("props tree ", props.treeData)}

      {/* <Tree
        value={props.treeData}
        selectionMode="single"
        selectionKeys={props.selectedNode}
        onSelectionChange={(e) => props.setSelectedNode(e.value)}
        className="w-full md:w-30rem"
      /> */}
    </div>
  );
}
