import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import QRCode from "react-qr-code";
import { useTheme } from "@mui/material/styles";

const textStyle = {
  //   color: "#cccccc",
  fontSize: "20px",
  fontWeight: 300,
  fontFamily: "Raleway, sans-serif",
  //   textAlign: "center",
  letterSpacing: "1px",
  lineHeight: "2rem",
  //   textTransform: "uppercase",
  //   textShadow: "1px 1px 2px black, 0 0 1em blue, 0 0 0.2em",
  //   width: "fit-content",
  backgroundColor: "#ccc",
  borderRadius: "10px",
  padding: "5px",
  paddingLeft: "10px",
};

const textStyle1 = {
  //   color: "#cccccc",
  fontSize: "20px",
  fontWeight: 300,
  fontFamily: "Raleway, sans-serif",
  textAlign: "center",
  letterSpacing: "1px",
  lineHeight: "2rem",
  //   textTransform: "uppercase",
  //   textShadow: "1px 1px 2px black, 0 0 1em blue, 0 0 0.2em",
  //   width: "fit-content",
  // backgroundColor: "#ccc",
  borderRadius: "10px",
  padding: "5px",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const handleLogBook = (event, setLogbook) => {
//   const {
//     target: { value },
//   } = event;
//   console.log(value);
//   setLogbook(
//     // On autofill we get a stringified value.
//     typeof value === "string" ? value.split(",") : value
//   );
// };

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName
      ? personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
      : null,
  };
}

const EditAssetItem = ({
  selectedNode,
  setAssetName,
  setCategory,
  setLogbook,
  logbookList,
  theme,
  setLocation,
  setManufacturer,
  setModel,
  setSerialNo,
  setDescription,
  setUnit,
  setCapacity,
  handleLogBook,
  setGroups,
  handleGroups,
  groupList,
  groups,
  handleDepartmentFilter,
  setDepartment,
  setLogbookList,
  departmentList,
  logbook,
}) => {
  console.log("EditAssetItem.selectedNode.logbook", selectedNode.logbook);
  return (
    <Grid container spacing={1}>
      <Grid
        item
        container
        xs={12}
        spacing={0.5}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>
          <QRcodeGenerator value={selectedNode.id} />
        </Typography>
      </Grid>
      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Asset ID:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>
            {selectedNode.id}
            {/* <BarcodeGenerator value={selectedNode.id} /> */}
          </Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Asset Name:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Asset Name"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.assetName}
            // value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Category:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.category}
            // value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Groups:</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="select-groups">Select Groups</InputLabel>
            <Select
              labelId="select-groups"
              label="Select Groups"
              multiple
              defaultValue={selectedNode.groups || []}
              // value={groups}
              onChange={(e) => handleGroups(e, setGroups)}
              input={
                <OutlinedInput
                  id="select-multiple-chip"
                  label="Select Groups"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {/* <MenuItem value="" disabled>
                      Test
                    </MenuItem> */}
              {groupList.map((itm, index) => (
                <MenuItem
                  key={itm}
                  value={itm}
                  style={getStyles(itm, selectedNode.groups, theme)}
                >
                  <Checkbox
                    checked={
                      selectedNode.groups &&
                      selectedNode.groups.indexOf(itm) > -1
                    }
                  />
                  <ListItemText primary={itm} />
                  {/* {itm} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Department:</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="select-department">Select Department</InputLabel>
            <Select
              labelId="select-department"
              label="Select Department"
              defaultValue={selectedNode.department}
              // value={department}
              // onChange={(e) => setDepartment(e.target.value)}
              onChange={(e) =>
                handleDepartmentFilter(
                  e,
                  setDepartment,
                  setLogbookList,
                  setLogbook
                )
              }
            >
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              {departmentList.map((itm, index) => (
                <MenuItem key={index} value={itm}>
                  {itm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Logbooks:</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="select-logbook">Select Logbook</InputLabel>
            <Select
              labelId="select-logbook"
              label="Select Logbook"
              multiple
              // default
              // defaultValue={selectedNode.logbook || []}
              // value={selectedNode.logbook || []}
              value={logbook}
              onChange={(e) => handleLogBook(e, setLogbook)}
              input={
                <OutlinedInput
                  id="select-multiple-chip"
                  label="Select Logbook"
                />
              }
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }}
                >
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {/* <MenuItem value="" disabled>
                      Test
                    </MenuItem> */}
              {logbookList.map((itm, index) => (
                <MenuItem
                  key={itm}
                  value={itm}
                  style={getStyles(itm, logbook, theme)}
                >
                  <Checkbox
                    checked={logbook.length > 0 && logbook.indexOf(itm) > -1}
                  />
                  <ListItemText primary={itm} />
                  {/* {itm} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Location:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.location}
            // value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Manufacturer:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Manufacturer"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.manufacturer}
            // value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Model:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Enter Model"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.model}
            // value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Serial Number:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Serial No"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.serialno}
            // value={serialno}
            onChange={(e) => setSerialNo(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Description:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.description}
            // value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Unit:</Typography>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="select-unit-of-measurement">
              Select unit Of measurement
            </InputLabel>
            <Select
              labelId="select-unit-of-measurement"
              label="Select unit Of measurement"
              defaultValue={selectedNode.unit}
              // value={unit}
              onChange={(e) => setUnit(e.target.value)}
            >
              <MenuItem key="1" value="Kg">
                Kg
              </MenuItem>
              <MenuItem key="2" value="Litre">
                Litre
              </MenuItem>
              <MenuItem key="3" value="Length">
                Length
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Capacity:</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Capacity"
            variant="outlined"
            fullWidth
            defaultValue={selectedNode.capacity}
            // value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EditAssetItem;

const QRcodeGenerator = ({ value, size = 100 }) => {
  return (
    <QRCode
      title={value}
      // value={value}
      // // level="level"
      size={100}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={value}
      viewBox={`0 0 256 256`}
    />
  );
};
