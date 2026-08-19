import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

export default function LogbookSelectionDialog(props){

        {console.log(props)}
        <>
        
        
        <Dialog visible={props.visible} style={{width : 500, height : 600, backgroundColor : 'green'}} onHide={props.onHide}>
        {/* <Dropdown value={props.selectedLogbook} options={props.logbooks} onChange={(e) => {
            
            props.setSelectedLogbook(e.value);
        
        }}/> */}
        </Dialog>   
        </>
}