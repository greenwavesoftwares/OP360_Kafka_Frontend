import LogbookReportViewComponent from "./LogbookReportViewComponent";
import {
  forminfoByformNameAndVersionApi,
  getTransactionByJobidAndActivityidApi,
  pdfDetailsApi,
  singlePdfDownloadApi,
} from "../../LogbookReports/LogbookReportsApi";
import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { getUserByTenantIdApi } from "../../Tenant/TenantApi";

const LView = () => {
  const [jobId, setJobId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [transactionData, setTransactionData] = useState();
  const [error, setError] = useState("");
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [formatId, setFormatId] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [gridData, setGridData] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [assetName, setAssetName] = useState("");
  const [tenentUserData, setTenentUserData] = useState();

  // useEffect(() => {
  //   if (selectedLogbook !== "") {
  //     const versions = allFormInfo
  //       .filter((item) => item.formName === selectedLogbook)
  //       .map((item) => item.versionNumber);
  //     setVersions(versions);
  //     setSelectedVersion(0);
  //   } else {
  //     setVersions([]);
  //   }
  // }, [selectedLogbook]);

  useEffect(() => {
    console.log("transactionData : ", transactionData);
    const updateCurrentData = async () => {
      setGridData(transactionData);
      console.log("gridData : ", gridData);
      if (transactionData) {
        forminfoByformNameAndVersion(
          transactionData.formName,
          transactionData.formversion
        );
        const pdfDetails = async () => {
          const data = await pdfDetailsApi(
            transactionData.jobId,
            transactionData.activityId
          );
          setActivityName(data.activityName || "NA");
          setAssetName(data.assetName || "NA");
          setTaskName(data.taskName || "NA");
          console.log("pdfDetails : ", data);
        };
        pdfDetails();
      }
    };
    updateCurrentData();
  }, [transactionData]);

  const forminfoByformNameAndVersion = async (formName, formversion) => {
    const data = await forminfoByformNameAndVersionApi(formName, formversion);
    setFormatId(data.formatId);
    setDocumentId(data.documentID);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("jobId : ", jobId, " : activityId : ", activityId);
    try {
      const data = await getTransactionByJobidAndActivityidApi(
        jobId,
        activityId
      );
      const tenentUserData = await getUserByTenantIdApi();
      if (tenentUserData) {
        setTenentUserData(tenentUserData);
      }
      console.log("tenentUserData : ", tenentUserData);
      setTransactionData(data);
      console.log("allTransactionData : ", data);
      setError("");
      setShowDataGrid(true);
      // forminfoByformNameAndVersion();
    } catch (error) {
      setError("Error fetching logbook data");
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await singlePdfDownloadApi(
        gridData.formName,
        gridData.formversion,
        0
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `filename.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div>
      <h1>Logbook View</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Enter JobId :
            <InputText
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter JobId:"
              required
            />
          </label>
          <br />
          <label>
            Enter ActivityId :
            <InputText
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              placeholder="Enter ActivityId :"
              required
            />
          </label>
          <br />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </div>
      </form>
      {showDataGrid && (
        <>
          <div>
            {gridData && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="card flex justify-content-center"></div>
                  <div className="LogbookName">
                    <span>{gridData.formName}</span>
                  </div>
                  <div className="HeaderRightSideText">
                    <p>
                      Version Number: <span>{gridData.formversion}</span>
                    </p>
                    <p>Format id: {formatId}</p>
                    <p>Document id: {documentId}</p>
                    <p>Time Stamp: {gridData.transactionTimestamp}</p>
                  </div>
                </div>
                <div>
                  {/* <LogbookReportViewComponent gridData={gridData} /> */}
                  <LogbookReportViewComponent
                    gridData={gridData}
                    formatId={formatId}
                    documentId={documentId}
                    // isLoading={isLoading}
                    tenentUserData={tenentUserData}
                    taskName={taskName}
                    activityName={activityName}
                    assetName={assetName}
                  />
                  <div
                    className="footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <div
                      className="FooterLeftSide"
                      style={{ marginLeft: "2rem" }}
                    >
                      {/* <p>Greenwave Solutions Pvt Ltd.</p>
                        <p>
                          Office-GB, 32/3Q Gariahat Road South, Kolkata - 700031
                        </p>
                        <p>
                          Works- Webel HRDC, P1 Taratala Road, Kolkata- 700088
                        </p>
                        <p>Phone-033 24148203, CIN-U72200WB2010PTC150431</p>
                        <p>Email-info@greenwave.co.in</p> */}
                      <p>
                        {tenentUserData.plantName
                          ? tenentUserData.plantName
                          : "NA"}
                      </p>
                      <p>
                        {tenentUserData.address ? tenentUserData.address : "NA"}
                      </p>
                      <p>
                        Division:{" "}
                        {tenentUserData.division
                          ? tenentUserData.division
                          : "NA"}
                      </p>
                      <p>
                        Phone:{" "}
                        {tenentUserData.phoneNumber
                          ? tenentUserData.phoneNumber
                          : "0000"}
                      </p>
                      <p>
                        Email:{" "}
                        {tenentUserData.email ? tenentUserData.email : "NA"}
                      </p>
                    </div>
                    <div className="FooterRightSide">
                      <p>Task Name: {taskName} </p>
                      <p>Job Id: {gridData.jobId} </p>
                      <p>Activity Name: {activityName} </p>
                      <p>Asset: {assetName} </p>
                      <p>Activity Id: {gridData.activityId} </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* <div>
            <Button variant="contained" onClick={handleExportPDF}>
              Export PDF
            </Button>
          </div> */}
          <div>
            <Button variant="contained" onClick={handleExportPDF}>
              Export PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LView;
