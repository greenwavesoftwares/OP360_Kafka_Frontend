import { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import LogButton from "../components/shared/button/MyButton";
import { Chip, Grid, Typography } from "@mui/material";

export default function UserDetails(props) {
  const [user, setUser] = useState(props.user);
  const [logDialogVisibile, setLogDialogVisibile] = useState(false);
  //   const [transactions,setTransactions] = useState(props.transactions);

  console.log(props);

  useEffect(() => {
    console.log("User Props : ",props.user)
    setUser(props.user);

    // setTransactions(props.transactions);

    console.log("logs Info",props.transactions);
  }, [props]);

  return (
    <>
      <Grid rowGap={0} container sx={{ mt: 2 }}>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            User Name
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.userName : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            User Email
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.userID : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            WorkFlow Home Page
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.workFlowHomePage : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            G360 Home Page
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.g360HomePage : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Alloted Pages
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user && user.allotedPages
              ? user.allotedPages.map((page) => (
                  <Chip
                    rounded
                    size="small"
                    style={{ marginRight: "0.2rem", marginBottom: "0.5rem" }}
                    label={page.page}
                  ></Chip>
                ))
              : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Phone Number
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.phone : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Created On
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.createdOn : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Modified On
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.modifiedOn : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Created By
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.createdBy : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Modified By
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.modifiedBy : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Last login
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.lastLogIn : "NA"}
          </Typography>
        </Grid>
        {/* <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Last login
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.lastLogIn : "NA"}
          </Typography>
        </Grid> */}
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Password Expiry Date
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <Typography sx={{ fontSize: "0.9rem" }}>
            {user ? user.passwordExpiryDate : ""}
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={3}
        >
          <Typography sx={{ fontWeight: "500", fontSize: "0.9rem" }}>
            Logs
          </Typography>
        </Grid>
        <Grid
          sx={{ padding: "0.5rem 1rem", border: 1, borderColor: "divider" }}
          item
          xs={9}
        >
          <LogButton
            trData={props.transactions}
            label="Logs"
            size="small"
            icon="pi pi-history"
            text
            raised
            onClickHandler={() => setLogDialogVisibile(true)}
            onHideHandler={() => setLogDialogVisibile(false)}
            visible={logDialogVisibile}
          ></LogButton>
        </Grid>
      </Grid>

      {/* <div style={{ textAlign: "center" }}>
        <div className="grid">
          <div className="col-6">
            <div className="text-center p-3 border-round-sm bg-primary font-bold">
              <h3>Logs</h3>
            </div>
          </div>

          <div className="col-6">
            <div className="text-center p-3 border-round-sm bg-primary font-bold">
              <LogButton
                trData={props.transactions}
                onClickHandler={() => setLogDialogVisibile(true)}
                onHideHandler={() => setLogDialogVisibile(false)}
                visible={logDialogVisibile}
              ></LogButton>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
