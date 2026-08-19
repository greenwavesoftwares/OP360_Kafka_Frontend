import { Grid, Typography } from "@mui/material";
import { MultiSelect } from "primereact/multiselect";

export default function GroupAndDepartment(props) {
  const { groups, depts, task, selectedGroupList, selectedDepartmentList } =
    props;
  console.log(groups);
  console.log("task ", task);

  return (
    <>
      <Grid container>
        <Grid
          sx={{
            border: "1px solid divider",
            borderColor: "divider",
          }}
          xs={3}
        >
          <Typography>Select Groups</Typography>
        </Grid>
        <Grid xs={3}>
          <MultiSelect
            style={{ width: "200px" }}
            value={selectedGroupList}
            options={groups}
            optionLabel="groupName"
            placeholder="Select Groups"
            onChange={(e) => {
              props.setSelectedGroupList(e.value);

              console.log(e.value);
            }}
          />
        </Grid>
        <Grid
          sx={{
            border: "1px solid divider",
            borderColor: "divider",
          }}
          xs={3}
        >
          <Typography>Select Departments</Typography>
        </Grid>
        <Grid xs={3}>
          <MultiSelect
            style={{ width: "200px" }}
            value={selectedDepartmentList}
            options={depts}
            placeholder="Select departments"
            onChange={(e) => {
              props.setSelectedDepartmentList(e.value);

              console.log(props.selectedDepartmentList);
            }}
            //style={{ position: "relative", left: "10rem", bottom: "8rem" ,fontSize : '1.2rem'}}
          />
        </Grid>
      </Grid>
    </>
  );
}
