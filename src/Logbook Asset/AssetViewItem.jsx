import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

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

const AssetViewItem = ({ selectedNode, logbookIdListMap }) => {
  function getKey(val) {
    return [...logbookIdListMap].find(([key, value]) => val === value)[0];
  }
  console.log("logbookIdListMap", logbookIdListMap);
  console.log("selectedNode.logbook", selectedNode.logbook);
  const keysList = selectedNode.logbook.map((val) => getKey(val));
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
          <Typography sx={textStyle1}>{selectedNode.assetName}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Category:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.category}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Groups:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>
            {selectedNode.groups.toString()}
          </Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Department:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.department}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Logbooks:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{keysList.toString()}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Location:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.location}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Manufacturer:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.manufacturer}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Model:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.model}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Serial Number:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.serialno}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Description:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.description}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Unit:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.unit}</Typography>
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={0.5}>
        <Grid item xs={6}>
          <Typography sx={textStyle}>Capacity:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography sx={textStyle1}>{selectedNode.capacity}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AssetViewItem;

const BarcodeGenerator = ({ value, width = 2, height = 50, fontSize = 18 }) => {
  return (
    <Barcode value={value} width={width} height={height} fontSize={fontSize} />
  );
};

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
