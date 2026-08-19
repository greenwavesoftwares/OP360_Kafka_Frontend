import React, { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Popover, Typography } from "@mui/material";

const DataTable = ({ property }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    // const field = event.currentTarget.dataset.field;
    // const id = event.currentTarget.parentElement.dataset.id;
    // const row = data.rows.find((r) => r.id === id);
    // setValue(row[field]);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box m="10px">
        <Typography
          variant="h3"
          color="Black"
          fontWeight="bold"
          fontSize="0.9rem"
          sx={{ marginLeft: "0.5rem" }}
          //sx={{ m: "0 0 5px 0", display: "flex", justifyContent: "center" }}
        >
          Asset
        </Typography>
      </Box>
      <Box
        m="10px"
        // height="75vh"
        // sx={{
        //   "& .MuiDataGrid-root": {
        //     border: "none",
        //     color: "white !important",
        //     background:"red"
        //   },
        //   "& .MuiDataGrid-cell": {
        //     borderBottom: "none",
        //   },
        //   "& .name-column--cell": {
        //     color: "#94e2cd",
        //   },
        //   "& .MuiDataGrid-columnHeaders": {
        //     backgroundColor: "#3e4396",
        //     color: "White",
        //     borderBottom: "none",
        //   },
        //   "& .MuiDataGrid-virtualScroller": {
        //     backgroundColor: "#1F2A40",
        //   },
        //   "& .MuiDataGrid-footerContainer": {
        //     borderTop: "none",
        //     backgroundColor: "#3e4396",
        //   },
        //   "& .MuiCheckbox-root": {
        //     color: "#b7ebde !important",
        //   },
        //   "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
        //     color: "#e0e0e0 !important",
        //   },
        // }}
      >
        <DataGrid
          rows={property.assetGroupList || []}
          columns={property.columns}
          // slots={{
          //   toolbar: GridToolbar,
          // }}
          // slotProps={{
          //   cell: {
          //     onMouseEnter: handlePopoverOpen,
          //     onMouseLeave: handlePopoverClose,
          //   },
          // }}
          onCellClick={property.handleOnCellClick}
        ></DataGrid>
        <Popover
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>"Hello How are you?"</Typography>
        </Popover>
      </Box>
    </Box>
  );
};

export default DataTable;
