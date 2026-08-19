
    import React, { useState, useMemo } from "react";
    import {
    Box,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    ListSubheader,
    TextField,
    InputAdornment
    } from "@mui/material";
    import SearchIcon from "@mui/icons-material/Search";
    import {motion,AnimatePresence, stagger} from "framer-motion";

    // const containsText = (text, searchText) =>
    //   text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    // const allOptions = ["Option One", "Option Two", "Option Three", "Option Four"];

    export default function UsersDropdown({usersDropdownList,selectedOption,setSelectedOption,dropdownLabel,handleDropdownChange,error,disabled,fullWidth,style}) {
    //const [selectedOption, setSelectedOption] = useState(usersDropdownList[0]);
    //   const containsText = (text, searchText) =>
    //   text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    const [searchText, setSearchText] = useState("");
    // const [lastSetValue,setLastSetValue]=useState("");

    const displayedOptions = useMemo(
        () => {
        const searchTextLowerCase = searchText.toLowerCase();
        // console.log('Current Search Text : ',searchTextLowerCase)
        return usersDropdownList.filter(
            option => 
            option.userName.toLowerCase().includes(searchTextLowerCase) ||
            option.userValue.toLowerCase().includes(searchTextLowerCase)
        );
        },
        [searchText, usersDropdownList]
    );
 
    const isOptionInRange = displayedOptions.some(
        option => option.userValue === selectedOption
      );
   
    
    return (
    
        <FormControl fullWidth={fullWidth} >
            <InputLabel id="search-select-label">{dropdownLabel}</InputLabel>
            <Select
            // sx={{minWidth:'400px'}}
            style={style}
            // Disables auto focus on MenuItems and allows TextField to be in focus
            required 
            // fullWidth={fullWidth}
            // fullWidth
            MenuProps={{ autoFocus: false }}
            labelId="search-select-label"
            id="search-select"
            disabled={disabled}
            // value={selectedOption}
             value={isOptionInRange ? selectedOption : ""}// because within the range of values if that particular value is not present , warning will occur
            label={dropdownLabel}
            onChange={handleDropdownChange}
            onClose={() => setSearchText("")}
            error={error}
            // This prevents rendering empty string in Select's value
            // if search text would exclude currently selected option.
            renderValue={(selected) => {
                const selectedItem = displayedOptions.find(option => option.userValue === selected);
                if (selectedItem) {
                  return (
                    <span>
                      <span style={{ fontWeight: "bold" }}>{selectedItem.userName}</span>{" "}
                      {selectedItem.userValue}
                    </span>
                  );
                } else {
                  return selected;
                }
              }}
            
            >
            {/* TextField is put into ListSubheader so that it doesn't
                act as a selectable item in the menu
                i.e. we can click the TextField without triggering any selection.*/}
            <ListSubheader>
                <TextField fullWidth
                size="small"
                // Autofocus on textfield
                autoFocus
                placeholder="Type to search..."
                //   fullWidth
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                    )
                }}
                onChange={(e) => {
                    selectedOption='';
                    setSearchText(e.target.value)}}
                onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                    }
                }}
                />
            </ListSubheader>
            {displayedOptions?.length > 0 &&
                            displayedOptions.map((itm, index) => (
                            <MenuItem key={index} value={itm.userValue}
                            // component={motion.div}
                            // whileHover={{ scale: 1.1, originX: 0 }}
                            // transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                {itm.userName}
                                </span>
                                {" " + itm.userValue}
                            </MenuItem>
                            ))}
            </Select>
        </FormControl>
    
    );
    }
