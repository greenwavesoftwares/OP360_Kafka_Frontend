
import { Dialog } from 'primereact/dialog';
import React from "react";

export default function CustomDialog({visible, setVisible,content,header}) {
    
    return (
        <div className="card flex justify-content-center">
            <Dialog header={header} visible={visible} onHide={() => {if (!visible) return; setVisible(false); }}>
                {content}
            </Dialog>
        </div>
    )
}
        