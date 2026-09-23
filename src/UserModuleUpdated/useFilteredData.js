import { useState, useMemo } from "react";
import useDebouncedValue from "./useDebouncedValue";
 
const useFilteredData = (data,searchType) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 700); // Apply 700ms debounce
 
  const filteredSearchData = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return data; // Return original data if search query is empty
 
   
  if (searchType === "AdminSearch") {
    return data.filter(
      (item) =>
        String(item.userID ?? "").toLowerCase().includes(debouncedSearchQuery?.toLowerCase()) ||
        String(item.userName ?? "").toLowerCase().includes(debouncedSearchQuery?.toLowerCase())
    );
  }
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    );
  }, [data, debouncedSearchQuery]);
 
  return { filteredSearchData, searchQuery, setSearchQuery };
};
 
export default useFilteredData;