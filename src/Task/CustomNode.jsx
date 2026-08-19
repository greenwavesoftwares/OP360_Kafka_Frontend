import { Handle, Position } from "reactflow";

const CustomNode = ({ data }) => {
  console.log('Custom node : ',data)
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "#fff",
        textAlign: "center",
        width: "min-content",
        //whiteSpace: "pre-wrap",
        fontSize: "0.5rem",
        // color: "red",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "red" }}
      />
      <div>{data.label}</div>
     <>{data.duration && <i className="pi pi-stopwatch" style={{ color: 'green' ,fontSize: '.6rem' }}>{data.duration}m</i>}</>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "blue" }}
      />
    </div>
  );
};
export default CustomNode;
