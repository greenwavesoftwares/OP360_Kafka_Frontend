import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Switch, Checkbox, Tooltip, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Paginator } from 'primereact/paginator';
import { formatDatetime, processWorkingHours } from './helper';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; 
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Tooltip as PrimeReactTooltip } from 'primereact/tooltip';
import dayjs from 'dayjs';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
export default function JobOverview({ activityList: updatedActivityList, setActivityList, setFinalJob, finalJob,allUsersData,weekdays,setSeverityType,setSeverityText,setSnackbarOpen,jobStartTime }) {
    const priorityListColor = {
        Critical: "red",
        Normal: 'orange',
        Low: 'blue',}
    const [selectAll, setSelectAll] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const activityList = updatedActivityList;
        

    const handleSelectAll = (event) => {
        const newState = event.target.checked;
        setSelectAll(newState);
        setActivityList((prevActivityList) => {
            const updatedList = prevActivityList.map((act) => ({ ...act, enforceStart: newState }));
            setFinalJob((prevFinalJob) => ({
                ...prevFinalJob,
                task: {
                    ...prevFinalJob.task,
                    activityList: updatedList,
                },
            }));
            return updatedList;
        });
    };


    useEffect(() => {
        processWorkingHours(activityList,allUsersData,weekdays,setActivityList);
          setSeverityType("success");
  setSeverityText("Working hours processed successfully!");
  setSnackbarOpen(true);
    }, []);


// console.log('All Users Data : ',allUsersData)
//   const processedActivityList = activityList.map(activity => {
//     console.log('Current Activity Performer : ',activity.performer)
//     const performerHours= allUsersData.find(user=>user.userID === activity.performer)?.workingHours// || "17:00-00:00"; // Default working hours if not provided
//     console.log('Perfromer Hours : ',performerHours)
//  activity.workingHours= performerHours;
//     if (
//     //   !activity.workingHours ||
//     //   typeof activity.workingHours !== "string" ||
//       !activity.scheduledActivityStartTime ||
//       !activity.scheduledActivityEndTime
//     ) {
//       return activity;
//     }

//     const [startStr, endStr] = activity.workingHours.split("-");
//     if (!startStr || !endStr) return activity;

//     const originalStart = dayjs(activity.scheduledActivityStartTime);
//     const originalEnd = dayjs(activity.scheduledActivityEndTime);

//     let remainingMinutes = originalEnd.diff(originalStart, "minute");

//     const [workStartHour, workStartMin] = startStr.trim().split(":").map(Number);
//     const [workEndHour, workEndMin] = endStr.trim().split(":").map(Number);

//     // const weekdays = activity.weekdays; // "5" or "6"

//     const isWorkingDay = (date) => {
//       const day = date.day(); // 0=Sun, 6=Sat

//       if (weekdays === "5") return day !== 0 && day !== 6;
//       if (weekdays === "6") return day !== 0;

//       return true;
//     };

//     let current = originalStart;

//     // Move to next valid working day
//     while (!isWorkingDay(current)) {
//       current = current.add(1, "day")
//         .hour(workStartHour)
//         .minute(workStartMin)
//         .second(0);
//     }

//     // Build working window for today
//     let workingStartToday = current.hour(workStartHour).minute(workStartMin).second(0);
//     let workingEndToday = current.hour(workEndHour).minute(workEndMin).second(0);

//     // Handle overnight shift
//     if (workingEndToday.isBefore(workingStartToday)) {
//       workingEndToday = workingEndToday.add(1, "day");
//     }

//     // Adjust start inside working hours
//     if (current.isBefore(workingStartToday)) {
//       current = workingStartToday;
//     }

//     if (current.isAfter(workingEndToday)) {
//       current = workingStartToday.add(1, "day");
//     }

//     const adjustedStart = current;

//     // 🔁 Consume duration
//     while (remainingMinutes > 0) {

//       if (!isWorkingDay(current)) {
//         current = current.add(1, "day")
//           .hour(workStartHour)
//           .minute(workStartMin)
//           .second(0);
//         continue;
//       }

//       workingStartToday = current.hour(workStartHour).minute(workStartMin).second(0);
//       workingEndToday = current.hour(workEndHour).minute(workEndMin).second(0);

//       if (workingEndToday.isBefore(workingStartToday)) {
//         workingEndToday = workingEndToday.add(1, "day");
//       }

//       const availableToday = workingEndToday.diff(current, "minute");

//       if (remainingMinutes <= availableToday) {
//         current = current.add(remainingMinutes, "minute");
//         remainingMinutes = 0;
//       } else {
//         remainingMinutes -= availableToday;

//         current = workingStartToday.add(1, "day");

//         // Skip weekends
//         while (!isWorkingDay(current)) {
//           current = current.add(1, "day");
//         }

//         current = current
//           .hour(workStartHour)
//           .minute(workStartMin)
//           .second(0);
//       }
//     }

//   return {
//   ...activity,
//   newScheduledActivityStartTime: dayjs(adjustedStart).format("DD-MM-YYYY HH:mm"),
//   newScheduledActivityEndTime: dayjs(current).format("DD-MM-YYYY HH:mm")
// };
//   });
//   console.log('Processed activityList : ',processedActivityList)
//   setSeverityType("success");
//   setSeverityText("Working hours processed successfully!");
//   setSnackbarOpen(true);
//   return processedActivityList;
// };
    
    

    return (
        <Fieldset 
  className="fieldSetStyle forToggleButton" 
  legend={
    <div style={{ display: "flex", alignItems: "center" }}>
    <FiberManualRecordIcon 
      style={{ color: priorityListColor[finalJob.priority], height: ".65rem" }} 
    />
    Job Overview
    {/* <PrimeReactTooltip data-pr-tooltip={finalJob.jobName} target=".jobNameJobOverview" />
      <InfoIcon className='jobNameJobOverview' fontSize='small' style={{height: ".65rem" ,cursor:"pointer"}}/> */}
   
  </div> 
  }
>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mt: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#eeeeee' }}>
                        <TableRow>
                            <TableCell align='center'><strong>Activity Name</strong></TableCell>
                            <TableCell align='center'><strong>Sequence</strong></TableCell>
                              <TableCell align='center'><strong>Logbook</strong></TableCell>
                            <TableCell align='center'><strong>Performer</strong></TableCell>
                            <TableCell align='center'><strong>Scheduled Start</strong></TableCell>
                            <TableCell align='center'><strong>Scheduled End</strong></TableCell>
                            <TableCell align='center'><strong>Duration</strong></TableCell>
                            <TableCell align='center'><strong>Working Hours</strong></TableCell>
                            <TableCell align='center' sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <strong>Enforce Start</strong>
                                <Checkbox size='small' checked={selectAll} onChange={handleSelectAll} color='primary' />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activityList.slice(first, first + rows).map((activity, index) => {
                           
                            const performer = activity.performerStatusList.find(p => p.userID === activity.performer)
                            const duration = `${Math.floor(activity.duration / 60)}h ${activity.duration % 60}m`;

                            return (
                                <TableRow key={activity.activityId} sx={{ backgroundColor: index % 2 ? '#fafafa' : 'inherit' }}>
                                    <TableCell align='center'>{activity.buffer ? <Tooltip title={`Buffer: ${activity.buffer} min`}><HourglassBottomIcon color='warning' fontSize='.1rem'/></Tooltip> : <></>}{activity.activityName || 'N/A'}</TableCell>
                                    <TableCell align='center'>{activity.sequence}</TableCell>
                                    <TableCell align='center'>{activity?.logbook??'N/A'}</TableCell>
                                    <TableCell align='center'>{activity.groupOrDept?activity.groupOrDeptName : performer ? performer.userName : 'N/A'}</TableCell>
                                    <TableCell align='center'>{formatDatetime(activity.scheduledActivityStartTime)}</TableCell>
                                    <TableCell align='center'>{formatDatetime(activity.scheduledActivityEndTime)}</TableCell>
                                    <TableCell align='center'><Chip label={duration} size='small' icon={< ScheduleIcon/>} color='info'/></TableCell>
                                    <TableCell align='center'><Chip label={activity.workingHours} size='small' icon={< ScheduleIcon/>} color='info'/></TableCell>
                                    <TableCell align='center'>
                                        <Switch size='small'
                                            checked={activity.enforceStart}
                                            onChange={(e) => {
                                                setActivityList((prevActivityList) => {
                                                    const updatedList = prevActivityList.map((act) =>
                                                        act.activityId === activity.activityId ? { ...act, enforceStart: e.target.checked } : act
                                                    );
                                                    setFinalJob((prevFinalJob) => ({
                                                        ...prevFinalJob,
                                                        task: {
                                                            ...prevFinalJob.task,
                                                            activityList: updatedList,
                                                        },
                                                    }));
                                                    return updatedList;
                                                });
                                            }}
                                            color='primary'
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginator
                first={first}
                rows={rows}
                totalRecords={activityList.length}
                onPageChange={(e) => setFirst(e.first)}
            />
        </Fieldset>
    );
}




