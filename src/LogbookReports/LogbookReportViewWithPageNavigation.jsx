import React, { useState } from "react";
import { allLogbookReportsApi } from "./LogbookReportsApi";
import { useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

function LogbookReportViewWithPageNavigation() {
  const creator = localStorage.getItem("username");
  const [allLogbookReportNames, setAllLogbookReportNames] = useState([]);
  const [reportName, setReportName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllLogbookReports();
  }, []);

  const fetchAllLogbookReports = async () => {
    try {
      const data = await allLogbookReportsApi(creator);
      console.log("AllLogbookReports : ", data);
      setAllLogbookReportNames(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReportSelection = (e) => {
    setReportName(e.value);
    console.log("e.value : ", e.value);
    navigate(`/workflow/reportview?selectedReport=${e.value}`);
  };

  return (
    <>
      <div>LogbookReportViewWithPageNavigation</div>
      <div>
        <label htmlFor="reportViewName" className="font-bold block mb-2">
          <h3>Select Report Name : </h3>
          <h3>{reportName}</h3>
        </label>
        <Dropdown
          id="reportViewName"
          value={reportName}
          onChange={handleReportSelection}
          options={allLogbookReportNames}
          // optionLabel="formName"
          placeholder="Select Report Name"
        />
      </div>
    </>
  );
}

export default LogbookReportViewWithPageNavigation;
