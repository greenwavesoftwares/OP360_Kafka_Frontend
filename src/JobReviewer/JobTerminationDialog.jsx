import { TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
export default function JobTerminationDialog(
{
  row,setRow,handleTerminateJobConfirm
}
) {
  const handleClose=()=>{
    setRow(null);
  }
  return (
    <div >
    <React.Fragment>
      
      {/* Dialog to write remarks */}
      <Dialog
        open={row!==null}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" >
        <div style={{display:'flex'}}>
            <Typography>Are you sure you want to terminate the job?</Typography>
          </div>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleTerminateJobConfirm} autoFocus color='success' style={{fontWeight:'bold'}}>Confirm</Button>
          <Button onClick={handleClose} autoFocus color='error' style={{fontWeight:'bold'}}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
    
  );
}