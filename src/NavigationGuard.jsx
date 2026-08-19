import { memo, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";


//** NOTE : This component is used to handle the back button press and page refresh or close event for pages with props 
const NavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  // Handle back button press
  const handleBackEvent = useCallback(() => {
    console.log("User clicked the back button");
    if(Boolean(sessionStorage.getItem("saveClose")) === true){
      console.log("saveClose bit present")
      let count = parseInt(sessionStorage.getItem("lastState"), 10) || 1;
      console.log("Navigating back", count, "times");
      sessionStorage.removeItem("saveClose");
      for (let i = 0; i < count; i++) {
        window.history.replaceState(null, "", location.pathname);
        navigate(-1);
      }
      saveHashes();
      
      return;
    }
    // navigate(-1);
    setVisible(true);
  }, []);

  // Handle page refresh or close
  const handleBeforeUnload = useCallback((event) => {
    if (sessionStorage.getItem("dialogOpen") === "true") {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome to cancel the reload
      return;
    }
  
    event.preventDefault();
    event.returnValue = "Are you sure you want to leave this page?";
  
    if (sessionStorage.getItem("pathName").toLowerCase() !== window.location.pathname.toLowerCase()) {
      sessionStorage.removeItem("pathName");
      sessionStorage.removeItem("lastState");
    }
    
    // saveHashes();

  }, []);

  const saveHashes=()=>
  {
    let currentKey =sessionStorage.getItem("currentHash");
    console.log('Current Key : ', currentKey);
    if (currentKey) {
      let prevHashes = sessionStorage.getItem("prevHashes");
    
      if (prevHashes) {
        let hashArray = prevHashes.split(",");
        if (!hashArray.includes(currentKey)) {
          hashArray.push(currentKey);
          sessionStorage.setItem("prevHashes", hashArray.join(","));
        }
      } else {
        sessionStorage.setItem("prevHashes", currentKey);
      }
    }
  }

  const verifyHashes=(hashes)=>
  {
    console.log('Current Hash includes itself : ', hashes.split(",").includes(window.history.state.key));
    if(hashes.split(",").includes(window.history.state.key)){
    console.warn("User is trying to access the page directly......")
    return false;
    }
    return true;
  }


  useEffect(() => {
    console.log("Current location:", location.pathname);
    console.log("Navigation UseEffect called");
    sessionStorage.setItem("pathName", location.pathname);

    //before unload add that hash so that the user can't go back only thorough UI it would be possibles
    if(sessionStorage.getItem("prevHashes"))
    {
     const isValidHash= verifyHashes(sessionStorage.getItem("prevHashes"));
     console.log('isValidHash : ',isValidHash)
     if(!isValidHash){
      let count = parseInt(sessionStorage.getItem("lastState"), 10) || 1;
      console.log("Navigating back", count, "times");
  
      for (let i = 0; i < count+1; i++) {
        window.history.replaceState(null, "", location.pathname);
        navigate(-1);
      }
      return;
     }
    }

    if (Boolean(sessionStorage.getItem("dialogOpen") ?? false))
    {
      sessionStorage.removeItem("dialogOpen");
      window.history.pushState(window.history.state, "", location.pathname);
      // if(sessionStorage.getItem("lastState")){
      // let count = parseInt(sessionStorage.getItem("lastState"), 10);
      // sessionStorage.setItem("lastState", (count - 1).toString());
      // }

    }


    if ((Boolean(sessionStorage.getItem("dialogOpen") ?? false)  && window.history.state.key === sessionStorage.getItem("currentHash") )) {
      // Handle case where dialog is open
      console.log('User has bypassed previous dialog and is trying to access the page directly......')
      navigate(-1);
      return;
  }

  if(window.history.state.key !== sessionStorage.getItem("currentHash"))
  {
    console.log('Current Hash : ',window.history.state.key)
    console.log('Previous Hash : ',sessionStorage.getItem("currentHash"))
    console.log('Current Hash is not same as the previous hash......')
    sessionStorage.removeItem("lastState");
  }
  
    sessionStorage.removeItem("dialogOpen");
    if (!sessionStorage.getItem("lastState")) {
      sessionStorage.setItem("lastState", "1");
    } else {
      let count = parseInt(sessionStorage.getItem("lastState"), 10);
      sessionStorage.setItem("lastState", (count + 1).toString());
    }

    if(sessionStorage.getItem("currentHash")!==null){
    if(window.history.state.key === sessionStorage.getItem("currentHash") && parseInt(sessionStorage.getItem("lastState"),10) === 1 ){
      navigate(-1);
      window.history.replaceState(window.history.state, "", location.pathname);
      console.log('State Hash is same exiting......')
      setTimeout(() => {
        sessionStorage.removeItem("lastState");
      }, 100);

      return;
  }
}

    // Prevent immediate back navigation
    window.history.pushState(window.history.state, "", location.pathname);
    console.log('State has been pushed : ',window.history.state)
   
    sessionStorage.setItem("currentHash",window.history.state.key);

    console.log('A new state is getting pushed  in the history stack......')
    // sessionStorage.setItem("currentHash", window.history.state.key);
    
    window.addEventListener("popstate", handleBackEvent);
    window.addEventListener("beforeunload", handleBeforeUnload);


    return () => {
      window.removeEventListener("popstate", handleBackEvent);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      addHash();
    };
  }, []);
  const addHash = () => {
    const currentHash = sessionStorage.getItem("currentHash");
    if (!currentHash) return; // Exit if currentHash doesn't exist
  
    let prevHashes = sessionStorage.getItem("prevHashes");
  
    if (prevHashes) {
      const hashArray = prevHashes.split(",");
      if (!hashArray.includes(currentHash)) {
        hashArray.push(currentHash);
        sessionStorage.setItem("prevHashes", hashArray.join(","));
      }
    } else {
      sessionStorage.setItem("prevHashes", currentHash);
    }
  };

  // Confirm Leave - Navigate back
  const handleConfirmLeave = useCallback(() => {
    sessionStorage.removeItem("dialogOpen");
    console.log("Leave called");
    setVisible(false);

    let count = parseInt(sessionStorage.getItem("lastState"), 10) || 1;
    console.log("Navigating back", count, "times");

    for (let i = 0; i < count; i++) {
      window.history.replaceState(null, "", location.pathname);
      navigate(-1);
    }
    saveHashes();

    sessionStorage.setItem("lastState", "0");
  }, [navigate, location.pathname]);

  // Cancel Navigation
  const handleCancel = useCallback(() => {
    sessionStorage.removeItem("dialogOpen");
    setVisible(false);
    window.history.pushState(window.history.state, "", location.pathname);
  }, [location.pathname]);

  // Memoized Dialog Footer
  const dialogFooter = (
    <div className="flex justify-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        iconPos="left"
        className="p-button-outlined p-button-sm py-1 px-3 text-xs"
        onClick={handleCancel}
      />
      <Button
        label="Leave"
        icon="pi pi-sign-out"
        iconPos="left"
        className="p-button-danger p-button-sm py-1 px-3 text-xs"
        onClick={handleConfirmLeave}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onShow={() => {console.log("Dialog shown")
        sessionStorage.setItem("dialogOpen", "true");
      }
      }
      onHide={handleCancel}
      header="Confirm Navigation"
      modal
      className="p-3 rounded-md shadow-md"
      footer={dialogFooter}
    >
      <p className="text-gray-600 text-sm">Are you sure you want to leave this page?</p>
    </Dialog>
  );
};

export default memo(NavigationGuard);
