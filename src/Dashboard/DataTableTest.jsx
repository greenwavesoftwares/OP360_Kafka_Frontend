import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes

const DataTableTest = () => {
  const data = [
    {
      plantId: "P009",
      ticketNo: "A20240510T161419883",
      ticket_raising_time: "2024-05-10 16:17:24.343",
      type: "a",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "pending",
    },
    {
      plantId: "P009",
      ticketNo: "D20240510T155233060",
      ticket_raising_time: "2024-05-10 15:53:27.52",
      type: "d",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "open",
    },
    {
      plantId: "P009",
      ticketNo: "D20240510T155219207",
      ticket_raising_time: "2024-05-10 15:52:33.003",
      type: "d",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "open",
    },
    {
      plantId: "P009",
      ticketNo: "I20240510T162421775",
      ticket_raising_time: "2024-05-10 16:25:37.32",
      type: "i",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "open",
    },
    {
      plantId: "P009",
      ticketNo: "I20240510T162421775",
      ticket_raising_time: "2024-05-10 16:25:37.32",
      type: "i",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "open",
    },
    {
      plantId: "P009",
      ticketNo: "I20240510T162537362",
      ticket_raising_time: "2024-05-10 16:26:17.0",
      type: "i",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "pending",
    },
    {
      plantId: "P009",
      ticketNo: "I20240510T162537362",
      ticket_raising_time: "2024-05-10 16:26:17.0",
      type: "i",
      user: "Tredipta Mondal",
      useremail: "tredipta.mondal@greenwave.co.in",
      status: "open",
    },
  ];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpenAssign, setDialogOpenAssign] = useState(false);
  // const [selectedRow, setSelectedRow] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const adminIds = ["Admin121", "Admin111", "Admin333", "Admin321"];

  const handleDetailClick = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleAssignClick = (row) => {
    setSelectedRow(row);
    setDialogOpenAssign(true);
  };

  const handleAssignClose = () => {
    setDialogOpenAssign(false);
    setSelectedRow(null);
    setSelectedAdminId("");
  };

  const handleAdminIdChange = (event) => {
    setSelectedAdminId(event.target.value);
  };

  const handleAddAssignment = () => {
    // Here you can implement the logic to add the assignment with the selected Admin ID
    console.log("Assigning to Admin ID:", selectedAdminId);
    handleAssignClose();
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plant ID</TableCell>
              <TableCell>Ticket No</TableCell>
              <TableCell>Ticket Raising Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>User</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View Detail</TableCell> {/* Add View Detail column */}
              <TableCell>Assign</TableCell> {/* Add Assign column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.ticketNo}>
                <TableCell>{row.plantId}</TableCell>
                <TableCell>{row.ticketNo}</TableCell>
                <TableCell>
                  {new Date(row.ticket_raising_time).toLocaleString()}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.useremail}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDetailClick(row)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      borderRadius: "5px",
                      padding: "8px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Detailss
                  </Button>{" "}
                  {/* Button for showing details */}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleAssignClick(row)}
                    disabled={row.status === "pending"}
                    style={{
                      backgroundColor:
                        row.status === "pending" ? "#ccc" : "#007bff",
                      color: "white",
                      borderRadius: "5px",
                      padding: "8px 16px",
                      cursor:
                        row.status === "pending" ? "not-allowed" : "pointer",
                    }}
                    // Disable button if status is "pending"
                  >
                    Assign
                  </Button>{" "}
                  {/* Button for assigning */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialog for showing details */}
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Details</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <div>
              <Typography>Plant ID: {selectedRow.plantId}</Typography>
              <Typography>Ticket No: {selectedRow.ticketNo}</Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog for assigning */}
      <Dialog open={dialogOpenAssign} onClose={handleAssignClose}>
        <DialogTitle>Assign Ticket</DialogTitle>
        <DialogContent>
          <Typography>Select Admin ID:</Typography>
          <Select value={selectedAdminId} onChange={handleAdminIdChange}>
            {adminIds.map((adminId) => (
              <MenuItem key={adminId} value={adminId}>
                {adminId}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleAddAssignment}>Subnit</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

DataTableTest.propTypes = {
  data: PropTypes.array.isRequired, // Define PropTypes
};

export default DataTableTest;
