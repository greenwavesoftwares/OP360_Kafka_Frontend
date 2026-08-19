// import { Button } from "primereact/button";
// import { Column } from "primereact/column";
// import { DataTable } from "primereact/datatable";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function OnDemandjobAssignHome() {
//   const [jobs, setJobs] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [allGroups, setAllGroups] = useState([]);
//   const [allDepts, setAllDepts] = useState([]);
//   const [allAssetGroups, setAllAssetGroups] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const getJobs = async () => {
//       await fetch("http://localhost:8099/jobs/getAllJobs")
//         .then((resp) => resp.json())
//         .then((data) => {
//           console.log(data);

//           if (data && data.length) {
//             //=================FROM CONTEXT================//
//             //  data = data.filter(job => job.Assigner === 'somnath.deshmukh@greenwave.co.in');
//             data = data.filter(
//               (job) => job.Assigner === localStorage.getItem("username")
//             );

//             setJobs(data);

//             console.log(data);
//           }

//           // setJobs(data);
//         });
//     };

//     getJobs();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       await fetch("http://localhost:8082/usermodule/allusers")
//         .then((resp) => resp.json())
//         .then((data) => {
//           console.log(data.payload);

//           // data.payload.sort((a,b) => a.userName.charAt(0) - b.userName.charAt(0));

//           setUsers(data.payload);

//           // console.log(rows);
//         });
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const options = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     };

//     const fetchAllGroups = async () => {
//       await fetch(
//         "http://localhost:8082/usermodule/getallgroupdetails",
//         options
//       )
//         .then((resp) => resp.json())
//         .then((data) => {
//           setAllGroups(data.payload);

//           console.log("userGroups", allGroups);
//         });
//     };

//     fetchAllGroups();
//   }, []);

//   useEffect(() => {
//     const options = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     };

//     const fetchAllDepts = async () => {
//       await fetch(
//         "http://localhost:8082/usermodule/getalldeptartments",
//         options
//       )
//         .then((resp) => resp.json())
//         .then((data) => {
//           setAllDepts(data.payload);

//           console.log("user dept", allDepts);
//         });
//     };

//     fetchAllDepts();
//   }, []);

//   useEffect(() => {
//     const options = {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     };

//     const fetchAllAssetGroups = async () => {
//       await fetch("http://localhost:8088/api/assetgroups", options)
//         .then((resp) => resp.json())
//         .then((data) => {
//           setAllAssetGroups(data);

//           console.log(data);
//         });
//     };

//     fetchAllAssetGroups();
//   }, []);

//   const addJobNavigationHandler = () => {
//     const options = {
//       state: {
//         users: users,
//         groups: allGroups,
//         depts: allDepts,
//         assetGroups: allAssetGroups,
//       },
//     };

//     navigate("/addJob", options);
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>Select rows to edit Draft Task</h2>

//       <>
//         <DataTable value={jobs} key="TaskId" stripedRows>
//           <Column field="TaskName" header="Job Name" />

//           <Column field="Assigner" header="Creator" />

//           <Column field="Approver" header="Approver" />

//           <Column field="Status" header="Status" />

//           <Column field="Status" header="Asset Group" />

//           <Column field="Status" header="User Groups" />

//           <Column field="Status" header="Departments" />
//         </DataTable>
//       </>

//       <Button
//         id=""
//         onClick={addJobNavigationHandler}
//         style={{
//           position: "relative",
//           left: "20rem",
//           top: "10rem",
//           backgroundColor: "#002db3",
//         }}
//       >
//         <i className="pi pi-plus-circle"></i>
//       </Button>
//     </div>
//   );
// }
import React from "react";

function OnDemandJobAssignHome() {
  return <div></div>;
}

export default OnDemandJobAssignHome;
