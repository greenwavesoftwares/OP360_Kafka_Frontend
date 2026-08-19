import { Tag } from "primereact/tag";

export default function AdminButton(props) {
  let style = {
    backgroundColor: "red",
    width: 60,
    height: 30,
    borderRadius: 100,
    color: "white",
  };

  if (props.adminStatus === true) {
    style.backgroundColor = "green";
  }

  return (
    props.text && (
      <Tag
        style={{ fontSize: "0.6rem", padding: "0.05rem 0.7rem 0rem 0.7rem" }}
        rounded
        severity={props.text === "G360 Admin" ? "success" : "warning"}
        value={props.text}
      ></Tag>
    )
  );
}
