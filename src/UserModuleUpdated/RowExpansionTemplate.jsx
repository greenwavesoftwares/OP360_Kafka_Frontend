import React, { useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import dayjs from "dayjs";
import LogButtonDashboard from "../components/shared/tag/LogButtonDashboard";
import { formatDatetime } from "../JobAssign/helper";
import { Tag } from "primereact/tag";

/**
 * A template function for the row expansion in the user overview table.
 * The function takes in the data for the row and returns a RowExpansionTemplate component with the data.
 * This template is used by the DataTable component to render the expanded rows.
 * @param {object} data - The data for the row.
 * @returns A RowExpansionTemplate component with the data.
 */
const RowExpansionTemplate = ({ data }) => {
  // console.log('rendered')
  function areArraysEqual(arr1, arr2, key) {
    if (arr1?.length !== arr2?.length) return false;

    const arr1Keys = arr1.map(item => item[key]).sort();
    const arr2Keys = arr2.map(item => item[key]).sort();

    return arr1Keys.every((value, index) => value === arr2Keys[index]);
  }

  const rows = useMemo(() => {
    const oldData = data.userDetails;
    const newData = data.newUserDetails;
   

    return [
      { label: "User ID", oldValue: oldData.userID, newValue: newData.userID, change: oldData.userID !== newData.userID },
      { label: "User Name", oldValue: oldData.userName, newValue: newData.userName, change: oldData.userName !== newData.userName },
      { label: "Phone", oldValue: oldData.phone, newValue: newData.phone, change: oldData.phone !== newData.phone },
      {
        label: "Group",
        oldValue: oldData.group?.map(gr => <Tag key={gr.groupName} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }} rounded value={gr.groupName} />),
        newValue: newData.group?.map(gr => <Tag key={gr.groupName} style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }} rounded value={gr.groupName} />),
        change: !areArraysEqual(oldData.group, newData.group, 'groupName')
      },
      { label: "Department", oldValue: oldData.department?.deptName, newValue: newData.department?.deptName, change: oldData.department?.deptName !== newData.department?.deptName },
      { label: "OP360 Home Page", oldValue: oldData.workFlowHomePage, newValue: newData.workFlowHomePage, change: oldData.workFlowHomePage !== newData.workFlowHomePage },
      {
        label: "G360 Admin",
        oldValue: <LogButtonDashboard text={oldData.g360Admin ? "Yes" : "No"} adminStatus={oldData.g360Admin} />,
        newValue: <LogButtonDashboard text={newData.g360Admin ? "Yes" : "No"} adminStatus={newData.g360Admin} />,
        change: oldData.g360Admin !== newData.g360Admin
      },
      {
        label: "Active",
        oldValue: <LogButtonDashboard text={oldData.active ? "Yes" : "No"} adminStatus={oldData.active} />,
        newValue: <LogButtonDashboard text={newData.active ? "Yes" : "No"} adminStatus={newData.active} />,
        change: oldData.active !== newData.active
      },
      {
        label: "Modified On",
        oldValue: dayjs(oldData.modifiedOn).isValid() ? formatDatetime(dayjs(oldData.modifiedOn)) : "",
        newValue: dayjs(newData.modifiedOn).isValid() ? formatDatetime(dayjs(newData.modifiedOn)) : "",
        change: dayjs(oldData.modifiedOn).isValid() && dayjs(newData.modifiedOn).isValid() ? !dayjs(oldData.modifiedOn).isSame(dayjs(newData.modifiedOn)) : oldData.modifiedOn !== newData.modifiedOn
      },
      { label: "Modified By", oldValue: oldData.modifiedBy, newValue: newData.modifiedBy, change: oldData.modifiedBy !== newData.modifiedBy },
      {
        label: "Password Required For First Login",
        oldValue: <LogButtonDashboard text={oldData.firstLoginRequired ? "Yes" : "No"} adminStatus={oldData.firstLoginRequired} />,
        newValue: <LogButtonDashboard text={newData.firstLoginRequired ? "Yes" : "No"} adminStatus={newData.firstLoginRequired} />,
        change: oldData.firstLoginRequired !== newData.firstLoginRequired
      },
      { label: "Password Duration", oldValue: oldData.passwordExpiryDuration, newValue: newData.passwordExpiryDuration, change: oldData.passwordExpiryDuration !== newData.passwordExpiryDuration },
      {
        label: "Allotted Pages",
        oldValue: oldData.allotedPages?.map(page => (
          <Tag key={page.aliasName} rounded severity="success" style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }} value={page.aliasName} />
        )),
        newValue: newData.allotedPages?.map(page => (
          <Tag key={page.aliasName} rounded severity="success" style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }} value={page.aliasName} />
        )),
        change: !areArraysEqual(oldData.allotedPages, newData.allotedPages, 'aliasName')
      },
      {
        label: "Working Hours", oldValue: oldData.workingHours, newValue: newData.workingHours, change: oldData.workingHours !== newData.workingHours
      }
    ];
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container sx={{ border: "1px solid #f5f5f5", boxShadow: 1 }}>
          {/* Header Row */}
          <Grid container item xs={12} sx={{ background: "#e0e0e0", borderBottom: "1px solid #eeeeee" }}>
            <Grid item xs={4} sx={{ padding: "0.7rem 1rem", textAlign: "center" }}>
              <Typography sx={{ fontWeight: "700" }}>Fields</Typography>
            </Grid>
            <Grid item xs={4} sx={{ padding: "0.7rem 1rem", textAlign: "center" }}>
              <Typography sx={{ fontWeight: "700" }}>Old Data</Typography>
            </Grid>
            <Grid item xs={4} sx={{ padding: "0.7rem 1rem", textAlign: "center" }}>
              <Typography sx={{ fontWeight: "700" }}>New Data</Typography>
            </Grid>
          </Grid>

          {/* Data Rows */}
          {rows.map(({ label, oldValue, newValue, change }) => (
            <Grid container key={label}>
              <Grid item xs={4} sx={{ padding: "0.7rem 1rem", border: "1px solid #f5f5f5" }}>
                <Typography>{label}</Typography>
              </Grid>
              <Grid item xs={4} sx={{ padding: "0.7rem 1rem", border: "1px solid #f5f5f5" }}>
                {oldValue}
              </Grid>
              <Grid item xs={4} sx={{ padding: "0.7rem 1rem", border: "1px solid #f5f5f5" }}>
                <div>
                  {change && <FiberManualRecordIcon fontSize="small" color="error" style={{ width: ".95rem", height: ".95rem", marginRight: ".89rem" }} />}
                  {newValue}
                </div>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RowExpansionTemplate;
