import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import Grid from "@mui/material/Grid";
import {
  getAllDepartmentDetails,
  getAllGroupDetails,
} from "../UserModuleUpdated/UsermoduleApi";

const DocumentForm = ({
  department,
  setDepartment,
  group,
  setGroup,
  documentId,
  setDocumentId,
  formatID,
  setformatID,
  disable,
}) => {
  // const [department, setDepartment] = useState(null);
  // const [group, setGroup] = useState([]); // Change initial state to an array for multiselect
  // const [documentId, setDocumentId] = useState("");
  // const [formatID, setFormatId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    setAllGroupsAndDepartments();
  }, []);
  const setAllGroupsAndDepartments = async () => {
    setDepartments(await getAllDepartmentDetails());
    setGroups(await getAllGroupDetails());
  };

  // const groups = [
  //   {
  //     active: true,
  //     groupID: "admin@greenwave.co.in",
  //     groupName: "Admin",
  //     homePage: "",
  //     phone: 0,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "Data Science",
  //     groupName: "Data Science",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "gwswdevelopment@greenwave.co.in",
  //     groupName: "Developer",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "gwswsupport",
  //     groupName: "Support",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "mergeSupport@greenwave.co.in",
  //     groupName: "Merge Support",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "science",
  //     groupName: "Science2467",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "test@greenwave.co.in",
  //     groupName: "Test",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "test2@greenwave.co.in",
  //     groupName: "Test2",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  //   {
  //     active: true,
  //     groupID: "thingworx",
  //     groupName: "Thingworx",
  //     homePage: "",
  //     phone: null,
  //     tenantId: "GWSW",
  //   },
  // ];

  

  return (
    <Grid container spacing={2}>
      {/* Department Dropdown */}
      <Grid item xs={6}>
        <div className="p-field fromStyle">
          <label htmlFor="department" className="text-sm fromLableStyle">Department *</label>
          <Dropdown
            id="department"
            value={department}
            optionValue="deptID"
            optionLabel="deptName"
            options={departments}
            onChange={(e) => setDepartment(e.value)}
            placeholder="Select a Department"
            filter
            className="w-11rem p-inputtext-sm"
            filterBy="label"
            showClear
          />
        </div>
      </Grid>

      {/* Groups MultiSelect */}
      <Grid item xs={6} >
        <div className="p-field fromStyle">
          <label htmlFor="group" className="text-sm fromLableStyleNew">Groups *</label>
          <MultiSelect // Use MultiSelect for multiple selections
            id="group"
            value={group}
            optionLabel="groupName"
            optionValue="groupID"
            options={groups}
            onChange={(e) => setGroup(e.value)}
              placeholder="Select Groups"
              filter
            //filterBy="label"
              showClear
              display="comma" // Display selected items as chips
            //maxSelectedLabels={2} // Show only 3 chip
            //selectedItemsLabel="2"
             className="mutiSelectStyle"
             focusOnHover={false}
          />
        </div>
      </Grid>

      {/* Document ID Input */}
      <Grid item xs={6}>
        <div className="p-field fromStyle">
          <label htmlFor="documentId" className="text-sm fromLableStyle">Document ID *</label>
          <InputText
            disabled={disable}
            id="documentId"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Enter Document ID"
            className="w-11rem p-inputtext-sm"
          />
        </div>
      </Grid>

      {/* Format ID Input */}
      <Grid item xs={6}>
        <div className="p-field fromStyle">
          <label htmlFor="formatID" className="text-sm fromLableStyleNew">Format ID *</label>
          <InputText
            disabled={disable}
            id="formatID"
            value={formatID}
            onChange={(e) => setformatID(e.target.value)}
            placeholder="Enter Format ID"
            className="w-11rem p-inputtext-sm"
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default DocumentForm;
