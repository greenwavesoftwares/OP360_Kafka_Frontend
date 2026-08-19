import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled"; // Importing AccessTimeFilled icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Importing AccountCircle icon
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; // Importing AdminPanelSettings icon
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; // Importing CalendarMonth icon
import CancelIcon from "@mui/icons-material/Cancel"; // Importing Cancel icon
import EditIcon from "@mui/icons-material/Edit"; // Importing Edit icon
import EmailIcon from "@mui/icons-material/Email"; // Importing Email icon
import GroupsIcon from "@mui/icons-material/Groups"; // Importing Groups icon
import HomeIcon from "@mui/icons-material/Home"; // Importing Home icon
import ManageHistoryIcon from "@mui/icons-material/ManageHistory"; // Importing ManageHistory icon
import PagesIcon from "@mui/icons-material/Pages"; // Importing Pages icon
import PhoneIcon from "@mui/icons-material/Phone"; // Importing Phone icon
import SaveIcon from "@mui/icons-material/Save"; // Importing Save icon
import WorkspacesIcon from "@mui/icons-material/Workspaces"; // Importing Workspaces icon
import { Chip, Grid, IconButton, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"; // Importing various MUI components like Chip, Grid, IconButton, etc.
import dayjs from "dayjs"; // Importing dayjs for date manipulation
import { Button } from "primereact/button"; // Importing Button from PrimeReact
import { Column } from "primereact/column"; // Importing Column component for PrimeReact DataTable
import { DataTable } from "primereact/datatable"; // Importing DataTable component from PrimeReact
import { Dialog } from "primereact/dialog"; // Importing Dialog component from PrimeReact
import { Toast } from "primereact/toast"; // Importing Toast component for displaying notifications
import { useEffect, useRef, useState } from "react"; // Importing hooks: useRef for referencing DOM elements, useState for state management
import { formatDatetime } from "../JobAssign/helper"; // Importing helper function to format date and time
import { getCurrentUser } from "../UserModuleUpdated/helper"; // Importing helper function to get the current user details
import RowExpansionTemplate from "../UserModuleUpdated/RowExpansionTemplate"; // Importing a template component for row expansion in the data table
import {
  getTransactionsDataByUserId,
  saveUser,
} from "../UserModuleUpdated/UsermoduleApi"; // Importing API functions to fetch transaction data and save user details
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAllotedPagesByUserId } from "../CommonAPI";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function UserDetails({ currentUser: user, setCurrentUser }) {
  // const [user, setUser] = useState(currentUser);
  // const [logDialogVisibile, setLogDialogVisibile] = useState(false);
  const [transactionsDialog, setTransactionsDialog] = useState(false); // State to manage the visibility of the transactions dialog
  const [transactionsDialogData, setTransactionsDialogData] = useState({}); // State to store the data related to the transactions dialog
  const [expandedRows, setExpandedRows] = useState(null); // State to track which rows are expanded in the DataTable
  const [editMode, setEditMode] = useState(false); // State to toggle between edit mode and view mode
  const [newUserName, setNewUserName] = useState(user.userName); // State to hold the new user name, initialized with the current user's username
  const toast = useRef(null); // useRef to reference the Toast component for displaying notifications
  const theme = useTheme(); // Access the current theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate=useNavigate()




 
  //   const [transactions,setTransactions] = useState(props.transactions);

  /**
   * Fetches and formats transactions for the current user.
   *
   * This function retrieves the transaction data for the current user using their user ID.
   * It formats the timestamp of each transaction to a more readable AM/PM format.
   * The formatted transaction data is then set to the state to be displayed in a dialog.
   * If transaction data is available, it triggers the opening of the transactions dialog.
   */
  const handleTransactions = async () => {
    // console.log(rowData); // This will log the entire row data related to the button
    const userTransactions = await getTransactionsDataByUserId(
      getCurrentUser()
    );
    // console.log(userTransactions);

    if (userTransactions) {
      const formattedTransactions = userTransactions.map((transaction) => {
        return {
          ...transaction,
          timestamp: formatDatetime(dayjs(transaction.timestamp)), // Formats the timestamp to AM/PM
        };
      });

      // console.log("Transactions Data : ", formattedTransactions);
      setTransactionsDialogData(formattedTransactions);
      setTransactionsDialog(true);
    }
  };

  
  const rowExpansionTemplate = (data) => {
    return <RowExpansionTemplate data={data} />;
  };

  /**
   * Handles the saving of a new user name.
   *
   * This function is called when the user attempts to save a new user name.
   * It first checks if the new user name is different from the current one.
   * If not, it exits edit mode and resets the new user name input.
   * If the user name has changed, it creates an updated user object,
   * calls the `saveUser` API to update the user name, and displays a success or error message
   * based on the API response. It also updates the current user state with the new user name.
   *
   * @returns {Promise<void>}
   */

  const handleSaveNewUserName = async () => {
    // console.log('handleSaveNewUserName() called')

    const userObject = JSON.parse(JSON.stringify(user)); //To crate a  deep copy of the user
    if (userObject.userName === newUserName) {
      setEditMode(false);

      setNewUserName(user.userName);
      return;
    }
    const updatedUser = { ...userObject, userName: newUserName,modifiedBy:getCurrentUser() };

    const userUpdated = await saveUser(updatedUser); //updating the user
    if (userUpdated) {
      //If the user is updated then the corresponding username is also updated
      toast.current.show({
        severity: "success",
        summary: "Success",
        life: 3000,
      });
      setEditMode(false);

      setNewUserName(user.userName);
      setCurrentUser({ ...user, userName: newUserName });
    } //* show an error alert
    else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        // detail: "Please check your old password ! ",

        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} style={{ zIndex: "9999" }} />
      <Grid rowGap={0} container>
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "grid",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography
          component="div"
            sx={{
              fontWeight: "500",
              fontSize: "0.9rem",
              alignItems: "center",
              display: "grid",
              justifyContent: "start",
            }}
          >
            <Chip label="User Name" icon={<AccountCircleIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          {!editMode && (
            <Typography sx={{ fontSize: "0.9rem" }}
            component="div"
            >
              {user ? user.userName : ""}
            </Typography>
          )}

          {!editMode && (
            <IconButton
              size="small"
              onClick={() => {
                setNewUserName(user.userName);
                setEditMode(true);
              }}
            >
              <EditIcon color="info" fontSize="small" />
            </IconButton>
          )}

          {editMode && (
            //               <FloatLabel>
            //     <InputText id="username" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
            //     <label htmlFor="username">Username</label>
            // </FloatLabel>

            <div>
              <TextField
                variant="outlined"
                size="small" // This makes the TextField smaller
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />

              <IconButton
                size="small"
                onClick={() => {
                  // setEditMode(false)
                  handleSaveNewUserName();
                }}
                disabled={newUserName.trim().length===0}
              >
                <SaveIcon color="success" fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  setEditMode(false);
                  setNewUserName(user.userName);
                }}
                // disabled={ newUserName.length===0}
              >
                <CancelIcon color="error" fontSize="small" />
              </IconButton>
            </div>
          )}
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="Email" icon={<EmailIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }} component="div">
            {user ? user.userID : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="OP360 Home Page" icon={<HomeIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }} component="div">
            {user ? user.workFlowHomePage : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="G360 Home Page" icon={<HomeIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }} component="div">
            {user ? user.g360HomePage : ""}
          </Typography>
        </Grid>

        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}component="div">
            <Chip label="Department" icon={<WorkspacesIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }} component="div">
            {user ? user?.department?.deptName : ""}
          </Typography>
        </Grid>

        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="Groups" icon={<GroupsIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }} component="div">
            {user && user.group
              ? user?.group?.map((grp,index) => (
                  <Chip
                  key={index}
                    // rounded
                    color="info"
                    variant="outlined"
                    size="small"
                    style={{ marginRight: "0.2rem", marginBottom: "0.5rem" }}
                    label={grp?.groupName}
                  ></Chip>
                ))
              : ""}
          </Typography>
        </Grid>

        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="Alloted Pages" icon={<PagesIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" ,display: isMobile?'flex':"",
           flexDirection: isMobile?'row-reverse':"", flexWrap: isMobile?'wrap':"", 
           justifyContent:isMobile? 'center':"", alignItems: isMobile?'center':""}} component="div">
            {user && user.allotedPages
              ? user.allotedPages.map((page,index) => (
                  <Chip
                  key={index}
                    // rounded
                    size="small"
                    color="info"
                    variant="outlined"
                    style={{ marginRight: "0.2rem", marginBottom: "0.5rem" }}
                    label={page.page}
                  ></Chip>
                ))
              : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Phone Number" icon={<PhoneIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? user.phone : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Created On" icon={<CalendarMonthIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? formatDatetime(dayjs(user.createdOn)) : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Modified On" icon={<CalendarMonthIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? formatDatetime(dayjs(user.modifiedOn)) : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }} component="div">
            <Chip label="Created By" icon={<AdminPanelSettingsIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? user.createdBy : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Modified By" icon={<AdminPanelSettingsIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? user.modifiedBy : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Last Login" icon={<AccessTimeFilledIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? formatDatetime(dayjs(user.lastLogIn)) : "NA"}
          </Typography>
        </Grid>
      
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip
              label="Password Expiry Date"
              icon={<CalendarMonthIcon />}
            ></Chip>
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}   component="div">
            {user ? user.passwordExpiryDate : ""}
          </Typography>
        </Grid>
        <Grid
           sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}  component="div">
            <Chip label="Logs" icon={<ManageHistoryIcon />}></Chip>
          </Typography>
        </Grid>
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          {/* <LogButton
            // trData={props.transactions}
            label="Logs"
            size="small"
            icon="pi pi-history"
            text
            raised
            onClickHandler={() => setLogDialogVisibile(true)}
            onHideHandler={() => setLogDialogVisibile(false)}
            visible={logDialogVisibile}
          ></LogButton> */}
          <Button
            // label="Log"
            rounded
            icon="pi pi-file" // Add the PrimeIcon for a lock
            severity="info"
            onClick={() => handleTransactions()}
          />
        </Grid>

        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "grid",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={3}
          lg={3}
        >
          <Typography
          component="div"
            sx={{
              fontWeight: "500",
              fontSize: "0.9rem",
              alignItems: "center",
              display: "grid",
              justifyContent: "start",
            }}
          >
            <Chip label="Working Hours" icon={< AccessTimeIcon/>}></Chip>
          </Typography>
        </Grid>
        <Grid
          sx={{
            padding: "0.5rem 1rem",
            border: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "center", md: "start",lg:"start" }
          }}
          item
          xs={12}
          md={9}
          lg={9}
        >
          {!editMode && (
            <Typography sx={{ fontSize: "0.9rem" }}
            component="div"
            >
              {user ? user.workingHours : ""}
            </Typography>
          )}

         

       
        </Grid>
        <Grid>
          <Dialog
            visible={transactionsDialog}
            style={{ width:isMobile?"95%" :"70vw" }}
            onHide={() => {
              if (!transactionsDialog) return;
              setTransactionsDialog(false);
            }}
            header="Transactions"
          >
            <div>
              <DataTable
                className="UserInfoTableStyle dataTableStyle HeaderColor"
                value={transactionsDialogData}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="transaction_id"
                //header="Transactions"
                stripedRows
              >
                <Column expander />
                <Column
                  field="transaction_id"
                  header="Transaction ID"
                  sortable
                />
                <Column field="timestamp" header="Time" sortable />
                <Column body={(rowData)=><Chip label={rowData.modified_by}/>}  header="Modified By"  />
                <Column field="data" header="Information Modified"  />
              </DataTable>
            </div>
          </Dialog>
        </Grid>
      </Grid>

      
    </>
  );
}
