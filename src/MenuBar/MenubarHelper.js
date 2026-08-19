import { fetchAllotedPagesByUserId } from "../CommonAPI";

 //Function to check whether page access ids given
  export async function userHasPageAccess(path,navigate){
    console.log("userHasPageAccess() called ");
    try {
      // Fetch the user's allowed pages
      const allotedPages = await fetchAllotedPagesByUserId();
      console.log("Alloted Pages:", allotedPages);

      if (!allotedPages || !Array.isArray(allotedPages)) {
        console.warn("Invalid or empty allotedPages array.");
        navigate("/restricted");
        return;
      }

      // Get the current path
      const currentPath = path;
      console.log("Current Path:", currentPath);

      // Check if the current path exists in the alloted pages
      const hasAccess = allotedPages.some(
        (page) => page.toLowerCase().trim() === currentPath.toLowerCase().trim()
      );

      if (!hasAccess) {
        console.log("Access denied. Navigating to restricted.");
        navigate("/restricted");
      }
    } catch (error) {
      console.error("Error checking user access:", error);
      navigate("/restricted");
    }
  };