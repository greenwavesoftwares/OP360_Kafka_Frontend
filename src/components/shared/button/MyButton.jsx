import { Button } from "primereact/button";

export default function MyButton(props) {
  return (
    <Button
      type="button"
      size="small"
      icon={props.icon}
      severity={props.severity}
      label={props.label}
      style={props.style}
      onClick={props.clickHandler}
    ></Button>
  );
}
