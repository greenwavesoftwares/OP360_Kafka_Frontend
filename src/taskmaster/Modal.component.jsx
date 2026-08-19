import { Dialog } from "primereact/dialog";

    export default function CustomModal(props){

        const {message,visible,onHide} = props;
        
        return <Dialog visible={visible} onHide={onHide}>
            <h3>{message}</h3>
        </Dialog>
    }