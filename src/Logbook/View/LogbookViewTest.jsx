import LogbookReportViewComponent from "./LogbookReportViewComponent";
import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

import {
  forminfoByformNameAndVersionApi,
  getTransactionByJobidAndActivityidApi,
  pdfDetailsApi,
  singlePdfDownloadApi,
} from "../../LogbookReports/LogbookReportsApi";
import { Button, IconButton } from "@mui/material";

import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Chip } from "primereact/chip";

const LogbookViewTest = ({ jobId, activityId }) => {
  //jobId = "J20240408123203395"; // Hardcoded job ID
  //activityId = "A202404081213531353"; // Hardcoded activity ID
  const [transactionData, setTransactionData] = useState(null);
  const [gridData, setGridData] = useState(null); // Initialize gridData with null
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [showInfoDialog, setShowInfoDialog] = useState(false); // State to track visibility of info dialog
  const [error, setError] = useState("");
  const [formatId, setFormatId] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [activityName, setActivityName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [assetName, setAssetName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactionByJobidAndActivityidApi(
          jobId,
          activityId
        );
        setTransactionData(data);
        setShowDataGrid(true);
        setLoading(false); // Set loading to false after data is fetched
        if (!data) {
          setShowInfoDialog(true); // Show info dialog if transactionData is null
        }
      } catch (error) {
        console.error("Error fetching logbook data:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update gridData whenever transactionData changes
    if (transactionData) {
      setGridData(transactionData);
    }
  }, [transactionData]);

  return (
    <>
      {showInfoDialog ? (
        <div>
          {loading ? ( // Render ProgressSpinner if loading is true
            <ProgressSpinner style={{ width: "175px", height: "175px" }} />
          ) : (
            showDataGrid &&
            gridData && (
              // <>
              //   <div>
              //     {/* {gridData.formName} */}
              //     {/* Render other details here */}
              //     <LogbookReportViewComponent gridData={gridData} />
              //   </div>
              //   {/* Render footer here */}
              // </>
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
                  <LogbookReportViewComponent gridData={gridData} />
                  <div
                    className="footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                    }}
                  >
                    <div className="FooterLeftSide">
                      <p>Greenwave Solutions Pvt Ltd.</p>
                      <p>
                        Office-GB, 32/3Q Gariahat Road South, Kolkata - 700031
                      </p>
                      <p>
                        Works- Webel HRDC, P1 Taratala Road, Kolkata- 700088
                      </p>
                      <p>Phone-033 24148203, CIN-U72200WB2010PTC150431</p>
                      <p>Email-info@greenwave.co.in</p>
                    </div>
                    <div className="FooterRightSide">
                      <p>Task Name: NA </p>
                      <p>Job Id: {gridData.jobId} </p>
                      <p>Activity Name: NA </p>
                      <p>Asset: NA </p>
                      <p>Activity Id: {gridData.activityId} </p>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      ) : (
        <div>
          {/* {console.log("No data")} */}

          {/* <Card
            title="Info"
            // subTitle="No Transaction History Found"
          >
            No Transaction History Found For the Selected Activity
          </Card> */}
          <Chip label="No Transaction History Found" icon="pi pi-info-circle" />
        </div>
      )}
    </>
  );
};

export default LogbookViewTest;
