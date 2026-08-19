import { Tag } from "primereact/tag";

export default function ActiveStatus(props) {
  let style = {
    backgroundColor: "red",
    width: 60,
    height: 30,
    borderRadius: 100,
    color: "white",
  };

  let text = "Inactive";

  if (props.status === true) {
    style.backgroundColor = "green";
    text = "Active";
  }

  return (
    <Tag
      rounded
      icon={props.text === "Active" ? "pi pi-check" : "pi pi-times"}
      severity={props.text === "Active" ? "success" : "danger"}
      value={props.text}
    ></Tag>
  );
}
