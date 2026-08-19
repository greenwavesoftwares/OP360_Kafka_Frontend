import { Button } from "primereact/button";
import AddActivityDialog from "./AddActivityDialog";
import ActivityDetails from "./ActivityDetails";

export default function ActivityCreation(props){


    return <div>

<Button key='tr' type='button' onClick={() => props.setActivityDialogVisible(true)} label="add activity"
  style={{position : 'relative',top : 70, left : '20rem'}}><i className="pi pi-plus"></i></Button>

  <AddActivityDialog visible={props.activityDialogVisible} onHide={() => props.setActivityDialogVisible(false)} assetGroup={props.assetGroup} logbooks={props.logbooks}/>

 
  <span style={{position : 'relative',top : 100}}>

  <ActivityDetails task={props.task} activityConnections={props.activityConnections}/>

  </span>

        
    </div>
}