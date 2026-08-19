import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAllSelfJobsByUser, updateJobTime } from './SelfJobCreationAPI';
import { getCurrentUser } from '../UserModuleUpdated/helper';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { getData } from '../Logbook/OfflineLogbook/indexedDb';
import { getAllCellInfoByFormNameAndVersion, getAllTransactions, getFormInfoByFormName, getQueryResultForGlobalCellUpdate } from '../Logbook/LogbookApi';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getLocalVariablesForSelfJob, setLocalVariablesForSelfJob, updateJobsTable } from './SelfJobHelper';
import { Tooltip } from '@mui/material';
import { getTenantID } from '../UserModuleUpdated/UsermoduleApi';
import { formatDatetime } from '../JobAssign/helper';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { getJobDetailsBasedOnJobId } from '../JobPerformer/JobPerformerAPI';

export default function JobsTable({allSelfJobs,currentUser,setAllSelfJobs,setSnackbarMessage,setSnackbarSeverity,setSnackbarOpen,setOpenPendingJobDlg,setMainLogbookSelection}) {
    console.log('JobsTable : ',allSelfJobs)
    const [selfJobs, setSelfJobs] = useState([]);

    // console.log('JobsTable : ',pendingSelfJobs)
    const navigate = useNavigate();

    const location = useLocation();
     const [urlParam,_]=useSearchParams() // Hook to access and set URL search parameters

    useEffect(() => {
setSelfJobs(allSelfJobs);
checkOfflineDataForJobs(allSelfJobs);
  // Set a timer to run exactly once after 5 seconds
  const timerId = setTimeout(() => {
    checkOfflineDataForJobs(allSelfJobs);
  }, 5000);

    // Cleanup: cancels the timer if allSelfJobs changes again 
  // or the component unmounts before the 5 seconds are up
  return () => clearTimeout(timerId);
}, [allSelfJobs]);





const checkOfflineDataForJobs=async(jobs)=>{
  console.log('Checking offline data for jobs : ',jobs)
    const updatedJobs = await Promise.all(jobs.map(async (job) => {
      const localData = await checkOfflineDB(job, job?.formname, job?.logbookversion);
      console.log('LocalData : ',localData)
        return {...job, offlineDataPresent: localData?.isPresent, offlineData: localData?.offlineData};
    }));
    setSelfJobs(updatedJobs);
}


const checkOfflineDB=async(job,formName,formVersion)=>
{
    const JOB_ID=job?.jobid;
    const ACTIVITY_ID=job?.activityid;

    const localData=await getData(JOB_ID, ACTIVITY_ID);
    const latestTransactionDB=await getAllTransactions(JOB_ID,ACTIVITY_ID,formName,formVersion)

    console.log('Latest Transaction in DB : ',latestTransactionDB)
    console.log('isLocal Data Present  : ',localData)

    
    if((localData && latestTransactionDB?.length===0) || ( localData && !latestTransactionDB))//For First Time or in case the API is not working
    {
         return {offlineData:localData,isPresent:true}; // Local data exists and no transactions in DB, consider it as offline data
    }
    else if(localData && latestTransactionDB)
    {
        const latestTransactionTime=latestTransactionDB?.[latestTransactionDB.length -1]?.transactionTimestamp;
        const localDataTime=localData?.payload?.transactionTimestamp;

        console.log(
  'Latest TransactionTime (IST):',
  new Date(latestTransactionTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
);

console.log(
  'Local Offline Data Transaction Time (IST):',
  new Date(localDataTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
);
        if(localDataTime && latestTransactionTime)
        {
            const isOfflineDataNewer = new Date(localDataTime) > new Date(latestTransactionTime);
            console.log('Is Offline Data Newer than DB Transaction? : ',isOfflineDataNewer)

            return {offlineData:localData,isPresent:true};
        }
          return {offlineData:null,isPresent:false};;
    }
}

console.log('Updated SelfJobs : ',selfJobs)


    // const allPendingSelfJobs=async()=>
    // {
    //         // const selfJobs=await getAllSelfJobsByUser(getCurrentUser());
           
    //         const unapprovedJobs=pendingSelfJobs?.filter(job=>job.status.toLowerCase()!=='approved');
    //         console.log('Pending SelfJobs  User',unapprovedJobs)
    //         //  debugger;
    //         setSelfJobs(unapprovedJobs??[]);
    // }


    // const pendingSelfJobs = allSelfJobs?.filter(job => job.status.toLowerCase() !== 'approved') ?? [];

    const handleStop = async(rowData) => {
    console.log("Clicked row:", rowData);
    if(rowData?.offlineDataPresent)
    {
        setSnackbarMessage("Please review the workspace before completing the job !");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
    }
    
    

    const celldetails = await getAllCellInfoByFormNameAndVersion(
             rowData.formname,
             rowData.logbookversion,
           );
           const logbooktransaction = await getAllTransactions(
             rowData.jobid,
             rowData.activityid,
             rowData.formname,
             rowData.logbookversion,
            );


           const currentLogbookDetails = await getFormInfoByFormName(rowData.formname)
           
           console.log("currentLogbookDetails Details : ", currentLogbookDetails);
           
           const activeForm=currentLogbookDetails.find(form=>form.isActiveForm);
           
           console.log('Found Active Form : ',activeForm)
           


           //checks whether the logbook contains required fields
      const requiredUnfilled =
        celldetails?.some((cell) =>
          cell.cellData?.some(
            (cellDataObj) => cellDataObj.requiredfield === true,
          ),
        ) &&
        //if the logbook contains required field then it checks whether the required fields are filled or not
        // and whether the value is not Blob_File
        (logbooktransaction[0]?.logbookData === undefined ||
          logbooktransaction[0]?.logbookData === null ||
          Object.values(logbooktransaction[0]?.logbookData)?.some((obj) => {
            const isEmpty =
              obj?.value === null ||
              obj?.value === undefined ||
              obj?.value?.length === 0;
              
              return obj?.requiredfield === true && isEmpty;
            }));
            
            if (requiredUnfilled) {
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Please fill all the required fields in the workspace before completing the job !",
        );
        // setDisabled([]);
        return;
      }
      //Call function to execute save query
      //Call function to execute save query
      const saveResponse = await executeSaveQuery(
        activeForm,
        logbooktransaction,
        rowData,
      );


        if (saveResponse === null) {
          setSnackbarMessage("Error in Save Sql");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
      }
      
      
      await finishLastJob(rowData);

      
      
      // const success=await upda
      

      // const localData=await checkOfflineDB(rowData,rowData?.formname,rowData?.logbookversion);
      // console.log('is LocalDataPresent : ',localData)
//     if(localData?.isPresent)
//     {
//         const updatedSelfJobs=selfJobs.map(job => {
  //             if(job.jobid === rowData.jobid){
    //                 // console.log('Matched : ',jobid)
//                 return {...job, offlineDataPresent: true,offlineData:localData.offlineData}; // Add a new property to indicate offline data presence
//             }
//             return job;
//         });
//         console.log('Updated Self Jobs : ',updatedSelfJobs)
    //     setSelfJobs(updatedSelfJobs);
    // }


};








const executeSaveQuery = async (
  currentLogbookDetails,
  logbooktransaction,
  job,
) => {
  /**
   * Block to execute the save query
     */
    console.log("Inside save sql");
    
    const saveSql = currentLogbookDetails?.saveSQL;
    const transactionData = logbooktransaction[0]?.logbookData;
    console.log("save sql ", saveSql);
    if (!saveSql || saveSql.length === 0) {
      return;
    }
    console.log("Save sql:",saveSql)
    const lvDetails = createLocalVariablesForLogbook(job);
    console.log("Before replace")
    const generatedQuery = saveSql.replace(
      /\{\s*\{\s*([^}]+?)\s*\}\s*\}/g,
      /** matches plaeholders like {{key}} and key could be any value except }]+
       *
       * /g signifies all possible {{key}} in the string
       * and not just the first one should be replaced */
      (match, rawKey) => {
        console.log("Inside replace")
            console.log("match:",match)
    console.log("rawkey:",rawKey)
        const key = rawKey?.trim();
        const isTransactionKey = /^_(\d+)_(\d+)$/.test(key);
        /**
        The Regex Pattern: /^_(\d+)_(\d+)$/^ and $: 
        These are anchors. ^ marks the start of the string and $ marks the end. 
        This ensures the entire string must match the pattern with no extra characters 
        before or after. \d marks digits from 0-9.
        .test() matches whether the key matches with the pattern.

        Checks whether the key is in _1_2 kind of format
        */
        // 1. If transactionData is missing or key does not exist → keep original
        if (
  !key.startsWith("lv_") &&
  (
    !transactionData ||
    !Object.prototype.hasOwnProperty.call(transactionData, key)
  )
) {
          console.log("Inside first check")
          return match;
        }

        const value = transactionData?.[key]?.value;

        // 2. If value is null / undefined / empty → return SQL null
        if (!key.startsWith("lv_") &&(value === null || value === undefined || value === "")) {
          console.log("Inside second check")
          return null;
        }
        /**
         * wraps the string with quotes, and replaces all single quotes with double quotes ''
         * O'Brien → 'O''Brien'
         */
        // 3. If key is in {{_1_2}} format (transaction key)
        if (isTransactionKey) {
          console.log("Inside third check")
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`; // escape single quotes
          }
          return value;
        }

        // 4. If key starts with "lv_" → use lvDetails
        console.log("Prior to keys starting with lv")
        if (key.startsWith("lv_")) {
          const lvValue = lvDetails[key];
          console.log("Lv_Value:",lvValue)
          if (typeof lvValue === "string") {
            /**
             * wraps the string with quotes, and replaces all single quotes with double quotes ''
             * O'Brien → 'O''Brien'
             */
            return `'${lvValue.replace(/'/g, "''")}'`;
          }
          return lvValue;
        }

        // 5. Fallback → keep original placeholder
        return match;
      },
    );
    console.log("Prior to sql response");
    const sqlResult = await getQueryResultForGlobalCellUpdate(generatedQuery);

    return sqlResult;
  };
  

const finishLastJob = async (job) => {
    // console.log('finishLastJob() called')
    const updatedPayload = {...job};
    updatedPayload.activityendtime=new Date().toISOString();
    console.log("Updated Payload : ", updatedPayload);
    const success = await updateJobTime(updatedPayload);
    const updatedJobs=updateJobsTable(job.jobid,allSelfJobs);
    setAllSelfJobs(updatedJobs)
    if (success) {
      setSnackbarMessage("Data updated successfully !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenPendingJobDlg(false);
      setMainLogbookSelection("");
    } else {
      setSnackbarMessage("Error !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


const statusBodyTemplate = (rowData) => {
  const status = rowData.status?.toLowerCase();

  let severity = null;
  let value = rowData.status;

  if (status === 'approved' || status === 'started') {
    severity = 'info'; // green
  

} 
 else if (status === 'sent for approval') {
    severity = 'success'; // red
 }
else if (status === 'rejected') {
    severity = 'danger'; // red
  }

  return <Tag value={value} style={{fontSize:'.5rem'}}  rounded severity={severity} />;
};




const createLocalVariablesForLogbook=(rowData)=>
{

      const logbook_lv= getLocalVariablesForSelfJob(
            rowData.jobid,
            rowData.activityid,
            rowData.jobname,
            rowData.reviewer,
            rowData.performer,
            rowData.status,
            rowData.remarks,
            rowData.formname,
            rowData.logbookversion,
            rowData.activitystarttime
              ? formatDatetime(dayjs(rowData.activitystarttime))
              : null,
            rowData.activityendtime
              ?  formatDatetime(rowData.activityendtime)
              : null,
            rowData.reviewstarttime
              ?  formatDatetime(rowData.reviewstarttime)
              : null,
              getTenantID(),
              currentUser?.userName ?? '',
              currentUser?.phone ?? '',
              currentUser?.department?.deptName?? '',
          );
    
          logbook_lv.formId=rowData.logbookid;

          return logbook_lv;

}

const handleNavigate=(rowData)=>
{
    console.log('Navigate to Logbook with Offline Data : ',rowData)


     const logbook_lv= createLocalVariablesForLogbook(rowData);
      const env_errorMsg_key = process.env.REACT_APP_ERRORMSG;
  const env_isErrorKey = process.env.REACT_APP_ISERROR;
  const env_errorByKey = process.env.REACT_APP_ERRORBY;

  logbook_lv[env_errorMsg_key]=rowData?.offlineData?.errorMsg || 'Unknown Error';
  logbook_lv[env_isErrorKey]=rowData?.offlineData?.error|| false;
  logbook_lv[env_errorByKey]=rowData?.offlineData?.errorBy || 'Unknown User';

  const iSGuestUser=location.pathname.toLowerCase().includes('guest') 
  const guestTenant=urlParam.get('instance')??null;
    //   getLocalVariablesForSelfJob(
    //         rowData.jobid,
    //         rowData.activityid,
    //         rowData.jobname,
    //         rowData.reviewer,
    //         rowData.performer,
    //         rowData.status,
    //         rowData.remarks,
    //         rowData.formname,
    //         rowData.logbookversion,
    //         rowData.activitystarttime
    //           ? formatDatetime(dayjs(rowData.activitystarttime))
    //           : null,
    //         rowData.activityendtime
    //           ?  formatDatetime(rowData.activityendtime)
    //           : null,
    //         rowData.reviewstarttime
    //           ?  formatDatetime(rowData.reviewstarttime)
    //           : null,
    //           getTenantID(),
    //           currentUser?.userName ?? '',
    //           currentUser?.phone ?? '',
    //           currentUser?.department?.deptName?? '',
    //       );
    
    //       logbook_lv.formId=rowData.logbookid;
          navigate(
         iSGuestUser && guestTenant ?"/guest/LogbookForm":  "/workflow/LogbookForm"
              , {
               state: logbook_lv
             }
          );
    // const logbookState=getLocalVariablesForSelfJob(
    //     rowData?.jobid,
    //     rowData?.activityid,
    //     rowData?.formname,
    //     rowData?.logbookversion,
        
    //  );

    // )
}




const LOGBOOK_INFO=(rowData)=>
{
    console.log('Row Data in LOGBOOK_INFO : ',rowData)
    // const IsofflineData=checkOfflineDB(rowData,rowData?.formname,rowData?.logbookversion);
return <>
{
  <span
    onClick={() => handleNavigate(rowData)}
    style={{
      color: "#1976d2",
      textDecoration: "none",
      cursor: "pointer"
    }}
  >
    {rowData.formname}
  </span>
}
{/* {rowData.offlineDataPresent+"offlineDataPresent"} */}
{
  rowData?.offlineDataPresent && (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <Tooltip title={rowData?.offlineData.errorMsg || "Offline data present. Please review before proceeding."} placement="top">
        <WarningAmberIcon fontSize="small" color="warning" />
      </Tooltip>

      <span
        style={{
          color: "red",
          fontSize: ".7rem",
          whiteSpace: "normal",
          overflowWrap: "anywhere"
        }}
      >
        {rowData?.errorMessage}
      </span>
    </div>
  )
}
</>
}


const ERROR_INFO=(rowData)=>
{
    console.log("Error Info : ",rowData)
    const isError=rowData?.offlineDataPresent;
    return <>
    {isError && (
  <div
    style={{
      color: "red",
      fontSize: ".7rem",
      wordWrap: "break-word",
      whiteSpace: "normal"
    }}
  >
    {rowData?.offlineData?.errorMsg}
  </div>
)}
    {  !isError && <Tag value="N/A" severity="success" rounded style={{fontSize:'.5rem'}} />}

    </>
}

return (
   <div style={{ width: '100%', }}>
    <DataTable
        value={selfJobs}
        size="small"
        scrollable
        // scrollHeight="120px"   // ✅ fixed small height with scroll
        tableStyle={{  fontSize: '.8rem' }}
        emptyMessage="No pending self-jobs found."
    >
        <Column  field="jobname" header="Job" style={{ padding: '2px' }} />
        <Column field="formname" header="Workspace" style={{ padding: '2px' }}
        
        body={LOGBOOK_INFO}/>
       <Column
  field="status"
  header=" Job Status"
  body={statusBodyTemplate}
  style={{ padding: '2px' }}
/>

 {/* <Column header="Error" style={{ padding: '2px' }} body={ERROR_INFO}/> */}

        <Column
            header="Action"
            body={(rowData) => (
                // <Button
                //     icon="pi pi-eye"
                //     text
                //     size="small"
                //     style={{ padding: '2px' }}
                   
                // />

                // !rowData?.offlineDataPresent ?
                 <Popconfirm
    title="Confirmation"
    description="Are you sure to complete this job ?"
    okText="Yes"
    cancelText="No"
    onConfirm={(e) => {  handleStop(rowData)}}
  >
    <Tooltip title={"Stop"} placement="right">
                <Button icon="pi pi-stop-circle" rounded text severity="danger" aria-label="Cancel"  /></Tooltip>
                </Popconfirm>
                // :<Button icon="pi pi-arrow-up-right
// " rounded text severity="danger" aria-label="Cancel"  onClick={() => handleNavigate(rowData)} />
            )}
            style={{ width: '1rem', textAlign: 'center' }}
        />
    </DataTable>
</div>
);
}