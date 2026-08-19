import { Checkbox, Chip, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { Calendar } from "primereact/calendar";
import { formatDuration } from "./helper";
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimelapseIcon from '@mui/icons-material/Timelapse';


/**
 * The RepeatJob component to handle the repeat job date and interval.
 * @param {Date} fromdate The date from which the repeat job starts.
 * @param {Date} repeatJobDate The current repeat job date.
 * @param {(date: Date) => void} setRepeatJobDate The function to update the repeat job date.
 * @param {number} repeatInterval The current repeat interval in days.
 * @param {(interval: number) => void} setRepeatInterval The function to update the repeat interval.
 * @param {number} repeatHour The current repeat hour.
 * @param {(hour: number) => void} setRepeatHour The function to update the repeat hour.
 * @param {number} repeatMinute The current repeat minute.
 * @param {(minute: number) => void} setRepeatMinute The function to update the repeat minute.
 * @param {number} currentTotalActivityDuration The total duration of all activities in the job.
 * @param {string} weekdays The number of weekdays to exclude from the repeat interval.
 */
const RepeatJob = ({fromdate,repeatJobDate,setRepeatJobDate,repeatInterval,setRepeatInterval,repeatHour,setRepeatHour
,repeatMinute,setRepeatMinute,currentTotalActivityDuration,weekdays
}
) => {
   //const [date, setDate] = useState(dayjs());
// console.log('Current Selected FromDate() ',fromdate)
// console.log('Current Repeat Interval day : ',repeatInterval)
   useEffect(()=>
  {
    setRepeatJobDate(new Date(dayjs(fromdate)))
  },[])

 // Getting the theme object for styling from Material-UI
 const theme = useTheme();
 // Checking if the screen size is mobile based on theme breakpoints
 const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



/**
 * Handles the change event for minute input in the repeat job settings.
 * Converts the input value to a number, and if the value exceeds 59 minutes,
 * it calculates the additional hours and adjusts the repeat hour and minute
 * accordingly. If the total hours exceed 23, it also adjusts the repeat interval
 * by calculating the additional days. If the input value is less than 60 minutes,
 * it directly updates the repeat minute.
 * 
 * @param {Object} e - The event object containing the minute input value.
 */

  const handleMinuteChange = (e) => {
    let minutes = Number(e.target.value);
    if (minutes >= 60) {
      const additionalHours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      setRepeatHour(prevHour => {
        const totalHours = prevHour + additionalHours;
        if (totalHours >= 24) {
          const additionalDays = Math.floor(totalHours / 24);
          setRepeatInterval(prevInterval => prevInterval + additionalDays);
          return totalHours % 24;
        }
        return totalHours;
      });
      setRepeatMinute(remainingMinutes);
    } else {
      setRepeatMinute(minutes);
    }
  };

  /**
   * Handles the change event for hour input in the repeat job settings.
   * Converts the input value to a number, and if the value exceeds 23 hours,
   * it calculates the additional days and adjusts the repeat interval
   * accordingly. If the total hours is less than 24, it directly updates the
   * repeat hour.
   * @param {Object} e - The event object containing the hour input value.
   */
  const handleHourChange = (e) => {
    let hours = Number(e.target.value);
    if (hours >= 24) {
      const additionalDays = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      setRepeatInterval(prevInterval => prevInterval + additionalDays);
      setRepeatHour(remainingHours);
    } else {
      setRepeatHour(hours);
    }
  };

  
  return (
    <Grid container spacing={2}>
     

      <Grid item xs={12} sx={{
          display: isMobile?"grid":"flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          rowGap:isMobile?"0.5rem":""
        }}>
       <Chip
  label="Repeat Interval"
  icon={
    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
      <ScheduleIcon />
      {weekdays === "6" ? (
        <div style={{fontWeight:"bold"}}>
         ( Excluding Sunday )
        </div>
      ) : weekdays === "5" ? (
        <div style={{fontWeight:"bold"}}>
         ( Excluding Sat-Sun )
        </div>
      ) : (
        ""
      )}
    </div>
  }
  
/>

        <div>
          <Chip  sx={{fontWeight:"bold"}} color="info" icon={<TimelapseIcon/>} label={`Task Duration: ${formatDuration(currentTotalActivityDuration)}`}></Chip>
        </div>
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Day"
          type="number" // Use type "text" to allow input of numbers and decimals
          // defaultValue="0"
          value={repeatInterval}
          onChange={(e)=>{setRepeatInterval(e.target.value)}}
          // value={elem.numVal ? elem.numVal : ""}
          // onChange={handleInputChange}
          // onBlur={() => onCellValueChange(col)}
          required={true}
          // error={Number(repeatInterval)===0 && Number(repeatMinute)===0 && Number(repeatHour)===0 }
          InputProps={{
            inputProps: {
              max: "9999999999999",
              min: "0",
            },
          }}
        />
        {/* {(repeatInterval==="0" && repeatMinute==="0" && repeatHour==="0")+"helo"+typeof(repeatInterval)} */}
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Hour"
          type="number" // Use type "text" to allow input of numbers and decimals
          value={repeatHour}
          // error={Number(repeatInterval)===0 && Number(repeatMinute)===0 && Number(repeatHour)===0 }
          // value={elem.numVal ? elem.numVal : ""}
          // onChange={e=>setRepeatHour(e.target.value)}
          onChange={handleHourChange}
          // onBlur={() => onCellValueChange(col)}
          required={true}
          InputProps={{
            inputProps: {
              max: "9999999999999",
              min: "0",
            },
          }}
        />
      </Grid>

      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Minutes"
          type="number" // Use type "text" to allow input of numbers and decimals
          value={repeatMinute}
          // error={Number(repeatInterval)===0 && Number(repeatMinute)===0 && Number(repeatHour)===0 }
          // value={elem.numVal ? elem.numVal : ""}
          //  onChange={e=>setRepeatMinute(e.target.value)}
          onChange={handleMinuteChange}
          // onBlur={() => onCellValueChange(col)}
          required={true}
          InputProps={{
            inputProps: {
              max: "9999999999999",
              min: "0",
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography>Repeat Till</Typography>
      </Grid>

      <Grid item xs={12}>
      
        <Calendar showIcon id="calendar-12h" dateFormat="dd/mm/yy" value={repeatJobDate}  onChange={(e) => setRepeatJobDate(e.value)} minDate={new Date(fromdate)} showTime hourFormat="12" 
          disabledDays={
            weekdays === "5" ? [0, 6] : 
            weekdays === "6" ? [0] : 
            []
          }/>
      </Grid>
    </Grid>
  );
};

export default RepeatJob;
