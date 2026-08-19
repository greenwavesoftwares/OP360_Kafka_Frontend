



import { Fieldset } from 'primereact/fieldset';
import React, { useEffect } from 'react';
import { formatDatetime, processWorkingHours } from './helper';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Divider, Chip as MuiChip, Typography } from '@mui/material';
import { Icon } from '@mui/material';
import SwitchButton from '../Logbook Configure/SwitchButton';
import { ToggleButton } from 'primereact/togglebutton';


/**
 * JobOverview component displays an overview of activities within a job.
 * It renders each activity as a card with details such as activity name, performer,
 * scheduled start and end times, and duration.
 *
 * @param {Object} props - The component props
 * @param {Array} props.activityList - The list of activities to be displayed
 * @returns {JSX.Element} A JSX element representing the job overview
 */

export default function JobOverviewForMobile({activityList:updatedActivityList,setActivityList,setFinalJob,finalJob,allUsersData,weekdays,setSeverityType,setSeverityText,setSnackbarOpen}) {
    const activityList =updatedActivityList;

    useEffect(() => {
        processWorkingHours(activityList,allUsersData,weekdays,setActivityList);
          setSeverityType("success");
  setSeverityText("Working hours processed successfully!");
  setSnackbarOpen(true);
    }, []);

    return (
        <div>
            <Fieldset className='fieldSetStyle forToggleButton' legend="Job Overview" >
                <div style={{maxHeight: '200px', overflow: 'auto'}}> 
                        <div>
                        {activityList.map((activity, index) => {
                            const performer = activity.performerStatusList.find(p => p.userID === activity.performer);
                            const durationInMinutes = activity.duration;
                            const duration = `${Math.floor(durationInMinutes / 60)}h ${durationInMinutes % 60}m`;
            
                            return (
                                <Card
                                key={index}
                                className="noPadding"
                                style={{
                                    marginBottom: '1rem',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e4e4e4',
                                    borderRadius: '8px',
                                    fontSize:'.9rem'
                                }}
                            >
                                <div >
                                    {/* Activity Name Section */}
                                 <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <div
                                        style={{
                                            display: 'grid',
                                            paddingBottom: '0.5rem',
                                        }}
                                    >
                                        <div style={{ fontWeight: 'bold', color: '#333' }}>
                                          {activity.activityName || 'N/A'}
                                            <Typography sx={{fontSize:"0.65rem"}}>{`Activity Name (Sequence:${activity.sequence})`}</Typography>
                                        </div>
                                        {/* <Chip label="Activity Name"  style={{ marginRight: '8px', fontSize:'.9rem' }} /> */}
                                        
                                    </div>
                                    <ToggleButton 
                                                        className={`custom-toggle-button ${
                                                          activity.enforceStart
                                                            ? "toggle-button-active"
                                                            : "toggle-button-default"
                                                        }`}
                                                        onLabel="Enforce Enabled"
                                                        offLabel="Enforce Disabled"
                                                        onIcon="pi pi-play-circle
"
                                                         offIcon="pi pi-stop-circle"
                                                        checked={activity.enforceStart}
                                                        onChange={(e) => {
                                                            console.log('Previous Activity list:', activityList);
                                                            console.log("Enforce Start Value:", e.value);
                                                            console.log('Final Job:', finalJob);
                                                          
                                                            setActivityList((prevActivityList) => {
                                                              const updatedList = prevActivityList.map((act) =>
                                                                act.activityId === activity.activityId
                                                                  ? { ...act, enforceStart: e.value }
                                                                  : act
                                                              );
                                                          
                                                              console.log("Updated Activity List:", updatedList); // Log before updating state
                                                          
                                                              // Use the updated list inside setFinalJob
                                                              setFinalJob((prevFinalJob) => ({
                                                                ...prevFinalJob,
                                                                task: {
                                                                  ...prevFinalJob.task, // Preserve other properties inside task
                                                                  activityList: updatedList, // Update activityList
                                                                },
                                                              }));
                                                              
                                                          
                                                              return updatedList;
                                                            });
                                                          }}
                                                          
                                                          
                                                      />
                                                      </div>
                                    
                                    <Divider />
        
                                    {/* Performer Section with Icon */}
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center',paddingTop:"0.5rem" }}>
                                        <i className="pi pi-user" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}></i>
                                        <Typography sx={{fontSize:"0.88rem"}}><strong>Performer:</strong> {activity.groupOrDept?activity.groupOrDeptName : performer ? performer.userName : 'N/A'}</Typography>
                                    </div>
        
                                    {/* Scheduled Start Section with Icon */}
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="pi pi-calendar" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}></i>
                                        <Typography sx={{fontSize:"0.88rem"}}><strong>Scheduled Start:</strong> {formatDatetime(activity.scheduledActivityStartTime)}</Typography>
                                    </div>
        
                                    {/* Scheduled End Section with Icon */}
                                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="pi pi-calendar-times" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}></i>
                                        <Typography sx={{fontSize:"0.88rem"}}> <strong>Scheduled End:</strong> {formatDatetime(activity.scheduledActivityEndTime)}</Typography>
                                    </div>
        
                                    {/* Duration Section with Icon */}
                                    <div style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="pi pi-clock" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}></i>
                                        <Typography sx={{fontSize:"0.88rem"}}> <strong>Duration:</strong> {duration}</Typography>
                                    </div>
        
                                    
                                </div>
                            </Card>
                            );
                        })}
                    </div>
                </div>
            </Fieldset>
        </div>
    );
}
