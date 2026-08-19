import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound.component";
import Menubar from "./MenuBar/Menubar";
import BlankPage from "./test/BlankPage";
// import "font-awesome/css/font-awesome.min.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import "reactflow/dist/style.css";
import "react-toastify/dist/ReactToastify.css";
// import DemoMenu from "./MenuBar/demoMenu";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Tenant from "./Tenant/Tenant";
import PlantPage from "./Tenant/PlantPage";

export default function AdminRoutes() {
  const [isNotFound, setIsNotFound] = useState(false);
  const CustomNotFound = ({ setIsNotFoundComonent }) => {
    useEffect(() => {
      console.log("CustomNotFound mounted");
      setIsNotFoundComonent(true);
    }, []);
    return (
      <div>
        <NotFound />
      </div>
    );
  };
  return (
    <div>
      {!isNotFound && (
        <Menubar>
          <>
            <Routes>
              
              <Route
                path="/*"
                element={
                  <CustomNotFound setIsNotFoundComonent={setIsNotFound} />
                }
              />
              <Route path="/workflow/#" element={<BlankPage />} />
            </Routes>
          </>
        </Menubar>
      )}
      {isNotFound && (
        <Routes>
          <Route
            path="/*"
            element={<CustomNotFound setIsNotFoundComonent={setIsNotFound} />}
          />
        </Routes>
      )}
    </div>
  );
}
