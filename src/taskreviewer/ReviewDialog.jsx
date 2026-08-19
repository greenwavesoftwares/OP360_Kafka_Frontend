import { Dialog } from "primereact/dialog";
import ActivityDetails from "../taskmaster/ActivityDetails";

export default function ReviewDialog(props){

    return <Dialog visible={props.visible} onHide={props.hideHandler} style={{height : '20rem'}}>
            <ActivityDetails task={props.task} activityConnections={props.activityConnections}/>
        </Dialog >
}