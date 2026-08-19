import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
export default function CustomDialog({
  open,
  setOpen,
  proceedButtonText,
  proceedButtonClick,
  cancelButtonText,
  content,
  notProceedButtonClick,
}) {
  //   const [open, setOpen] = React.useState(false);

  //   const proceedButtonClick = () => {
  //     setOpen(true);
  //   };
  const handleButtonClick = () => {
    setOpen(false);
    proceedButtonClick();
  };
  const handleClose = () => {
    if (notProceedButtonClick) {
      notProceedButtonClick();
      setOpen(false);
      return;
    }
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <div>
      <React.Fragment>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}

        <Dialog
          sx={{ zIndex: "999999" }}
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!content && (
                <span style={{ fontSize: "17px", fontWeight: "bold" }}>
                  {}Are you sure you want to proceed ?
                </span>
              )}
              {content && (
                <>
                  <span style={{ fontSize: "17px", fontWeight: "bold" }}>
                    {content}
                  </span>
                </>
              )}
            </div>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={(theme) => ({
              position: "absolute",
              right: -2,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>

          <DialogActions>
            <Button
              onClick={handleButtonClick}
              style={{ color: "red", fontWeight: "bold" }}
            >
              {proceedButtonText}
            </Button>
            <Button
              onClick={handleClose}
              autoFocus
              style={{ fontWeight: "bold" }}
            >
              {cancelButtonText}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
