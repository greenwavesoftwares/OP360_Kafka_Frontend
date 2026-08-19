import { TextareaAutosize, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { InputTextarea } from 'primereact/inputtextarea';
import * as React from 'react';
export default function RemarksDialog(
{
  // props to open dialog,function to handle submit, function to handle cancel,props to write remarks
    open, setOpen,proceedButtonClick,remarks,setRemarks,confirmLabel,handleClose
}
) {
  const handleButtonClick=()=>{
    setOpen(false)
    proceedButtonClick()
  }
 
  return (
    <div >
    <React.Fragment>
      
      {/* Dialog to write remarks */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        <div style={{display:'flex'}}>
            <InputTextarea  placeholder={"Enter Remarks"} rows={4} cols={30} onChange={(event)=>setRemarks(event.target.value)} value={remarks}/>
          </div>
        </DialogTitle>
        <DialogActions>
          <Button disabled={remarks===null || remarks ===''|| remarks ===undefined} onClick={handleButtonClick} style={{fontWeight:'bold'}} color={confirmLabel==='Approve'?'success':confirmLabel==='Reject'?'error':'info'}>{confirmLabel}</Button>
          <Button onClick={handleClose} autoFocus color='error' style={{fontWeight:'bold'}}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
    
  );
}