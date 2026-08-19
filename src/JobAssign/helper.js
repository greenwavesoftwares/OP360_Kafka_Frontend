import dayjs from "dayjs";



/**
 * Adjusts the end date and time based on the specified start date, total duration, and weekdays to skip.
 * 
 * @param {String} startDate - The starting date and time
 * @param {Number} duration - The total duration in minutes
 * @param {String} weekdays - The option specifying which weekdays to skip ('5' for skipping Saturday and Sunday, '6' for skipping only Sunday)
 * 
 * @returns {Object} - The adjusted end date and time after skipping weekends or Sundays
 */
export function adjustForWeekdays(startDate, duration, weekdays) {
// console.log("Starting Date: ", startDate);
// console.log("Total Duration (minutes): ", duration);
// console.log("Weekdays option: ", weekdays);

    let remainingDuration = duration;
    let adjustedEndDate = dayjs(startDate);
    
// console.log("Initial Start Date: ", adjustedEndDate.format('D MMM YY h:mm A'));

    while (remainingDuration > 0) {
        const dayOfWeek = adjustedEndDate.day();

        if (dayOfWeek === 6 && weekdays === '5') {
            // Skip Saturday if '5' is selected for skipping weekends
// console.log("Saturday encountered, skipping to Monday");
            adjustedEndDate = adjustedEndDate.add(2, "day").hour(0).minute(0); // Jump to Monday 12:00 AM
        } else if (dayOfWeek === 0 && (weekdays === '5' || weekdays === '6')) {
            // Skip Sunday if '5' or '6' is selected for skipping weekends or just Sundays
// console.log("Sunday encountered, skipping to Monday");
            adjustedEndDate = adjustedEndDate.add(1, "day").hour(0).minute(0); // Jump to Monday 12:00 AM
        } else {
            // Calculate minutes till midnight
            const minutesTillMidnight = 1440 - (adjustedEndDate.hour() * 60 + adjustedEndDate.minute());
            if (remainingDuration > minutesTillMidnight) {
// console.log(`Adding ${minutesTillMidnight} minutes to reach the next day`);
                adjustedEndDate = adjustedEndDate.add(minutesTillMidnight, 'minute').hour(0).minute(0); // Start at 12:00 AM next day
                remainingDuration -= minutesTillMidnight;
            } else {
// console.log(`Adding the remaining duration of ${remainingDuration} minutes`);
                adjustedEndDate = adjustedEndDate.add(remainingDuration, 'minute');
                remainingDuration = 0; // No more duration left
            }
        }

// console.log("Updated time after adjustment: ", adjustedEndDate.format('D MMM YY h:mm A'));
    }

    return adjustedEndDate;
}


   /**
     * This function takes an array of activity objects, a start date, and a
     * string indicating which weekdays to skip, and returns a new array with
     * the activities' start and end times adjusted accordingly. The function
     * also applies skipping logic based on the weekdays specified.
     *
     * @param {Array} activityList - An array of activity objects
     * @param {String} fromdate - A date string in the format 'YYYY-MM-DDTHH:mm:ss.SSSZ'
     * @param {String} weekdays - A string indicating which weekdays to skip.
     *                            Possible values are '5' (skip Saturday and Sunday)
     *                            and '6' (skip only Sunday)
     *
     * @return {Array} - A new array with the activities' start and end times adjusted
     */
 export function fetchCurrentActivityList(activityList, fromdate, weekdays) {
   //let current_duration =0;
   // console.log('fetchCurrentActivityList() called')
   let current_starttime = dayjs(fromdate);

   console.log(
     "Current Start Time:",
     current_starttime.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
   );

   // Initialize objects to store start and end times for each sequence
   const sequenceStartTimes = {};
   const sequenceMaxEndTimes = {};

   const newList = activityList.map((obj, index) => {
     let startTime;
     let endTime;
     // let bufferDuration = obj.duration + obj.buffer;

     const activityDuration = obj.duration;
     const bufferDuration = obj.sequence === 1 ? 0 : obj.buffer; //if the sequence is 1 then no buffer is added to the first activity of the sequence

     // If the sequence has already been processed, use its start and end times
     if (sequenceStartTimes[obj.sequence]) {
       startTime = sequenceStartTimes[obj.sequence];
     } else {
       // For the first activity of a sequence, set the start time
       startTime = current_starttime.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
       sequenceStartTimes[obj.sequence] = startTime;
     }

     // Calculate the end time for the current activity
     const calculatedStartTime = dayjs(startTime)
       .add(bufferDuration, "minute")
       .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
     let calculatedEndTime = dayjs(calculatedStartTime).add(
       activityDuration,
       "minute"
     );

     // Apply skipping logic based on weekdays
     if (weekdays === "5") {
       // Skip weekends (Saturday and Sunday)
       calculatedEndTime = skipWeekends(calculatedStartTime, activityDuration);
     } else if (weekdays === "6") {
       // Skip only Sundays
       calculatedEndTime = skipSundays(calculatedStartTime, activityDuration);
     }

     endTime = calculatedEndTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

     // Update the maximum end time for the sequence
     if (
       !sequenceMaxEndTimes[obj.sequence] ||
       dayjs(endTime).isAfter(sequenceMaxEndTimes[obj.sequence])
     ) {
       sequenceMaxEndTimes[obj.sequence] = dayjs(endTime);
     }

     // Update current_starttime to the highest end time of this sequence
     current_starttime = dayjs(sequenceMaxEndTimes[obj.sequence]);

     // return {
     //     ...obj,
     //     actvityStatus: obj.actvityStatus || "Not Started",
     //     scheduledActivityStartTime: calculatedStartTime,
     //     scheduledActivityEndTime: endTime,

     // }

     console.log("Activity ID:", obj.activityId);

     console.log("obj.actvityStatus", index, obj.actvityStatus);

     return createActivity(
       obj.taskId || null,
       null,
       obj.jobId || null,
       obj.activityId || null,
       obj.activityName || null,
       obj.sequence || null,
       obj.logbook || null,
       obj.duration || null,
       obj.xPos || null,
       obj.yPos || null,
       obj.performer || "",
       obj.approver || "",
       calculatedStartTime,
       endTime,
       obj.actualActivityStartTime || null,
       obj.actualActivityEndTime || null,
       obj.notBelongToPerformer || false,
       obj.notBelongToApprover || false,
       obj.actvityStatus || "Not Started",
       obj.isActvityBtnDisableOnCompletion || false,
       obj.isActvityBtnDisbleForActvtOrder || false,
       obj.actAbrv || null,
       obj.available || true,
       obj.performerAvlReasons || [],
       obj.assetAvailable || true,
       obj.assetAvlReasons || [],
       obj.actualActvtyStrt || null,
       obj.actualActvtEnd || null,
       obj.reviewerActivityStartTime || null,
       obj.reviewerActivityStopTime || null,
       obj.remarks || null,
       obj?.assetIDList?.length === 1 ? obj.assetIDList[0] : obj.assetId || "",
       obj?.assetNameList?.length === 1
         ? obj.assetNameList[0]
         : obj.assetName || "",
       obj.assetIDList || [],
       obj.assetNameList || [],
       obj.groupOrDept || false,
       obj.groupOrDeptName || "",
       obj.performerType || null,
       obj.getGroupOrDeptWisePerformer || null,
       obj.completedActivity || 0,
       obj.pendingActivity || 0,
       obj.rejectedActivity || 0,
       obj.date || null,
       obj.actvtCount || 0,
       obj.actFile || null,
       obj.buffer || 0,
       obj.enforceStart || false,
       obj.delayDueToBuffer || null,
       obj.enforce || false,
       obj.selectedAssetList || null,
       obj.selectedAssetIdsList || null,
       obj.activityUserGroupList || [],
       obj.activityDepartment || "",
       obj.filterSelection || "individuals"
     );
   });
   return newList;
 }


/**
 * Creates an activity object with the specified attributes.
 */
   export function createActivity(taskId, taskName, jobId, activityId, activityName, sequence, logbook, duration, xPos, yPos, performer, approver, scheduledActivityStartTime, scheduledActivityEndTime, actualActivityStartTime, actualActivityEndTime, notBelongToPerformer, notBelongToApprover, actvityStatus, isActvityBtnDisableOnCompletion, isActvityBtnDisbleForActvtOrder, actAbrv, available, performerAvlReasons, assetAvailable, assetAvlReasons, actualActvtyStrt, actualActvtEnd, reviewerActivityStartTime, reviewerActivityStopTime, remarks, assetId, assetName, assetIDList, assetNameList, groupOrDept, groupOrDeptName, performerType, getGroupOrDeptWisePerformer, completedActivity, pendingActivity, rejectedActivity, date, actvtCount, actFile, buffer,enforceStart, delayDueToBuffer, enforce, selectedAssetList, selectedAssetIdsList,activityUserGroupList,
        activityDepartment,filterSelection) {
          console.log("createActivity() called")
          console.log("activityId", activityId);
          console.log("Activity Status",actvityStatus);
        return {
            taskId: taskId,
            taskName: taskName,
            jobId: jobId,
            activityId: activityId,
            activityName: activityName,
            sequence: sequence,
            logbook: logbook,
            duration: duration,
            xPos: xPos,
            yPos: yPos,
            performer: performer,
            approver: approver,
            scheduledActivityStartTime: scheduledActivityStartTime,
            scheduledActivityEndTime: scheduledActivityEndTime,
            actualActivityStartTime: actualActivityStartTime,
            actualActivityEndTime: actualActivityEndTime,
            notBelongToPerformer: notBelongToPerformer,
            notBelongToApprover: notBelongToApprover,
            // actvityStatus: actvityStatus,
            actvityStatus: actvityStatus ?? 'Not Started',
            isActvityBtnDisableOnCompletion: isActvityBtnDisableOnCompletion,
            isActvityBtnDisbleForActvtOrder: isActvityBtnDisbleForActvtOrder,
            actAbrv: actAbrv,
            available: available,
            performerAvlReasons: performerAvlReasons,
            assetAvailable: assetAvailable,
            assetAvlReasons: assetAvlReasons,
            actualActvtyStrt: actualActvtyStrt,
            actualActvtEnd: actualActvtEnd,
            reviewerActivityStartTime: reviewerActivityStartTime,
            reviewerActivityStopTime: reviewerActivityStopTime,
            remarks: remarks,
            assetId: assetId,
            assetName: assetName,
            assetIDList: assetIDList,
            assetNameList: assetNameList,
            groupOrDept: groupOrDept,
            groupOrDeptName: groupOrDeptName,
            performerType: performerType,
            getGroupOrDeptWisePerformer: getGroupOrDeptWisePerformer,
            completedActivity: completedActivity,
            pendingActivity: pendingActivity,
            rejectedActivity: rejectedActivity,
            date: date,
            actvtCount: actvtCount,
            actFile: actFile,
            buffer: buffer,
            enforceStart: enforceStart,
            delayDueToBuffer: delayDueToBuffer,
            enforce: enforce,
            selectedAssetList: selectedAssetList,
            selectedAssetIdsList: selectedAssetIdsList,
            activityUserGroupList:activityUserGroupList,
            activityDepartment:activityDepartment,
            filterSelection:filterSelection
            
        };
    }

    /**
     * Skips weekends (Saturday and Sunday) when adding the specified duration to the given start date.
     * 
     * @param {String} startDate - The starting date and time
     * @param {Number} duration - The total duration in minutes
     * 
     * @returns {Object} - The adjusted end date and time after skipping weekends
     */
    export function skipWeekends (startDate, duration){
        let adjustedEndDate = dayjs(startDate);
        let daysAdded = 0;
      
        while (daysAdded < duration) {
          const dayOfWeek = adjustedEndDate.day();
      
          // If it's Saturday (6) or Sunday (0), skip to Monday
          if (dayOfWeek === 6) {
            adjustedEndDate = adjustedEndDate.add(2, "day"); // Skip to Monday
          } else if (dayOfWeek === 0) {
            adjustedEndDate = adjustedEndDate.add(1, "day"); // Skip to Monday
          } else {
            // Only add minutes on weekdays
            adjustedEndDate = adjustedEndDate.add(1, "minute");
            daysAdded++;
          }
        }
      
        return adjustedEndDate;
      };
      
    
/**
 * Skips Sundays when adding the specified duration to the given start date.
 * 
 * @param {String} startDate - The starting date and time
 * @param {Number} duration - The total duration in minutes
 * 
 * @returns {Object} - The adjusted end date and time after skipping Sundays
 */
      export function skipSundays(startDate, duration) {
        let adjustedEndDate = dayjs(startDate);
        let minutesAdded = 0;
        
// console.log(`Start Date: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
// console.log(`Total Duration (minutes): ${duration}`);
        
        while (minutesAdded < duration) {
          const dayOfWeek = adjustedEndDate.day();
          
// console.log(`\nCurrent Date and Time: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
// console.log(`Day of the Week: ${dayOfWeek === 0 ? 'Sunday' : adjustedEndDate.format('dddd')}`);
// console.log(`Minutes Added So Far: ${minutesAdded}`);
      
          if (dayOfWeek === 0) {
            // If it's Sunday, skip to Monday 12:00 AM
            adjustedEndDate = adjustedEndDate.add(1, 'day').startOf('day');
// console.log('It\'s Sunday, skipping to Monday 12:00 AM');
// console.log(`New Date and Time after skipping: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
          } else {
            // Add minutes only on non-Sunday days
            const nextDay = adjustedEndDate.add(1, 'day').startOf('day');
            const remainingMinutesInDay = nextDay.diff(adjustedEndDate, 'minute');
            
// console.log(`Remaining Minutes in the Current Day: ${remainingMinutesInDay}`);
            
            if (remainingMinutesInDay + minutesAdded <= duration) {
              // If remaining minutes in the day are less than or equal to the remaining duration
              minutesAdded += remainingMinutesInDay;
              adjustedEndDate = nextDay; // Move to the next day
// console.log(`Worked through the day, advancing to the next day: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
            } else {
              // If remaining duration fits within the current day, add it and stop
              const minutesToAdd = duration - minutesAdded;
              adjustedEndDate = adjustedEndDate.add(minutesToAdd, 'minute');
              minutesAdded = duration; // End the loop
// console.log(`Adding the final ${minutesToAdd} minutes, finishing on: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
            }
          }
        }
      
// console.log(`\nFinal Adjusted End Date and Time: ${adjustedEndDate.format('D MMM YYYY h:mm A')}`);
        return adjustedEndDate;
      }


/**
 * Calculates the total duration for each sequence in the activity list.
 * 
 * @param {Array} activityList - The list of activities to calculate total duration for
 * 
 * @returns {Number} - The total duration of all activities with buffers included
 */
      export function calculateTotalDuration(activityList) {
// console.log('calculateTotalDuration() called');
      
        // Step 1: Calculate the total duration for each sequence
        const sequenceDurationMap = activityList.reduce((acc, activity) => {
          const { sequence, duration, buffer } = activity;
          const totalDuration = duration + buffer; // Add buffer to duration directly
          acc[sequence] = Math.max(acc[sequence] || 0, totalDuration); // Track the highest duration for the sequence
          return acc;
        }, {});
      
        // Step 2: Sum up the highest durations for all sequences
        const total_activity_duration = Object.values(sequenceDurationMap).reduce(
          (sum, duration) => sum + duration,
          0
        );
      
console.log("Task Total Duration (with buffers):", total_activity_duration);
      
        return total_activity_duration;
      }
      

     export function createTask(
        creationTime,
        taskName,
        taskId,
        status,
        reviewer,
        remarks,
        description,
        creator,
        hourMinutes,
        activityList
      ) {
        return {
          creationTime: creationTime || null,
          taskName: taskName || null,
          taskId: taskId || null,
          status: status || null,
          reviewer: reviewer || null,
          remarks: remarks || null,
          description: description || null,
          creator: creator || null,
          hourMinutes: hourMinutes || null,
          activityList: activityList || [],
        };
      }


/**
 * Creates a new Job Details object with the specified attributes.
 *
 * @param {Object} task - Task object associated with the job.
 * @param {String} jobName - Name of the job.
 * @param {String} jobID - Unique identifier for the job.
 * @param {String} instrument - Instrument associated with the job.
 * @param {String} assigner - User who assigned the job.
 * @param {String} approver - User who approved the job.
 * @param {String} scheduledJobStartTime - Scheduled start time of the job.
 * @param {String} scheduledJobEndTime - Scheduled end time of the job.
 * @param {String} actualJobStartTime - Actual start time of the job.
 * @param {String} actualJobEndTime - Actual end time of the job.
 * @param {String} priority - Priority of the job.
 * @param {String} groupId - Group ID associated with the job.
 * @param {String} weekdays - Weekdays to skip (5 = skip Saturday and Sunday, 6 = skip only Sunday)
 * @param {String} jobStatus - Current status of the job.
 * @param {Boolean} adhoc - Indicates if the job is an ad-hoc job.
 *
 * @return {Object} - A new Job Details object with the specified attributes.
 */
      export function createJobDetails(
        task,
        jobName,
        jobID,
        instrument,
        assigner,
        approver,
        scheduledJobStartTime,
        scheduledJobEndTime,
        actualJobStartTime,
        actualJobEndTime,
        priority,
        groupId,
        weekdays,
        jobStatus,
        adhoc
      ) {
        return {
          task: task || null,
          jobName: jobName || null, //This will be populated with the JobName
          jobID: jobID || null,
          instrument: instrument || null,
          assigner: assigner || null,
          approver: approver || null,
          scheduledJobStartTime: scheduledJobStartTime || null,
          scheduledJobEndTime: scheduledJobEndTime || null,
          actualJobStartTime: actualJobStartTime || null,
          actualJobEndTime: actualJobEndTime || null,
          priority: priority || null,
          groupId: groupId || null,
          weekdays: weekdays || null, //remember in the pojo itself the weekdays is set to 5
          jobStatus: "Not Started", //By default every new job create will have a default status of Not Started
          adhoc:adhoc || false
        };
      }


/**
 * Creates a user dropdown object with the specified user name and value.
 *
 * @param {String} userName - The name of the user to be displayed.
 * @param {String} userValue - The value associated with the user.
 *
 * @returns {Object} - An object containing the userName and userValue.
 */
       export function createUserDropdown(userName, userValue) {
    return {
      userName: userName,
      userValue: userValue,
    };
  }

/**
 * Formats a duration in minutes to a human-readable string in the format 'Xd Yh Zm', where X is the number of days, Y is the number of hours, and Z is the number of minutes.
 * @param {Number} minutesToFormat - The duration to format in minutes.
 * @returns {String} - The formatted duration string.
 */
  export function formatDuration(minutesToFormat) {
    const minutes = minutesToFormat;
    const days = Math.floor(minutes / 1440); // 1440 minutes in a day
    const hours = Math.floor((minutes % 1440) / 60); // 60 minutes in an hour
    const mins = minutes % 60;

    return `${days > 0 ? `${days}d ` : ""}${
      hours > 0 ? `${hours}h ` : ""
    }${mins}m`;
  }

/**
 * Formats a given date and time string into a human-readable format.
 *
 * @param {String} datetime - The date and time string to format.
 * @returns {String} - The formatted date and time string in the format 'D MMM YY h:mm A'.
 */
  export function formatDatetime(datetime)
  {
    return dayjs(datetime).format('D MMM YY h:mm A');
  }


  export function areActivityIdsMatching(result, currentActivityDetailsObject) {
    if (result.length !== currentActivityDetailsObject.length) {
      return false; // Different lengths, immediately return false
    }
  
    for (let i = 0; i < result.length; i++) {
      if (result[i].activityId !== currentActivityDetailsObject[i].activityId) {
        return false; // Mismatch found, return false immediately
      }
    }
  
    return true; // All activityIds match
  }

  export const getInitials = (username) => {
    if (!username) {
      // Check if username is not provided
      return "NA"; // Return 'NA' if no username
    }
    const nameParts = username.split(" "); // Split the username by spaces
    const slicePosition= nameParts.length > 2 ? nameParts.length:2;
    const initials = nameParts.length > 1
  ? nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  : nameParts[0]?.charAt(0).toUpperCase() || "NA";

return initials;
// Return the initials or 'NA' if no valid initials
  };



  export const generateToMailUsers = (finalRepeatableJobsArray,allUsersData,adhoc=false) => {
    const toMailList = new Set(); //*unique toMail users
    finalRepeatableJobsArray.forEach((job) => {
      job.task.activityList.forEach((activity) => {
        if(activity?.actvityStatus?.toLowerCase()==="started") return;
        if (activity?.performerType?.toLowerCase() === "group") {
          //* if the activity performers type is group then all the users belonging to that group will be added
          // console.log("Group ! ");
          const performers = allUsersData
            .filter((user) =>
              user.group.some(
                (group) => group.groupName === activity.groupOrDeptName
              )
            )
            .map((user) => user.userID);

          performers.forEach((user) => toMailList.add(user));
        } else if (activity?.performerType?.toLowerCase() === "department") {
          //deprecated
          // console.log("Department ! ");
          const performers = allUsersData
            .find((user) =>
              user.department.some(
                (dept) => dept.deptName === activity.groupOrDeptName
              )
            )
            .map((user) => user.userID);

          performers.forEach((user) => toMailList.add(user));
        } else {
          toMailList.add(activity.performer); //by default performer will be added
        }
      });
    });
    return toMailList;
  };


// export const processWorkingHours = (
//   activityList,
//   allUsersData,
//   weekdays,
//   setActivityList
// ) => {

// //   const sortedActivities = [...activityList].sort(
// //     (a, b) => a.sequence - b.sequence
// //   );

// //   let previousSequence = null;
// //   let previousSequenceMaxEnd = null;
// //   let currentSequenceStart = null;

// //   const isWorkingDay = (date) => {
// //     const day = date.day();
// //     if (weekdays === "5") return day !== 0 && day !== 6;
// //     if (weekdays === "6") return day !== 0;
// //     return true;
// //   };

// //   const processedActivityList = sortedActivities.map(activity => {

// //     const performerHours = allUsersData.find(
// //       user => user.userID === activity.performer
// //     )?.workingHours;

// //     console.log('Performer Hours :',performerHours)

// //     if (!performerHours) return activity;

// //     const [startStr, endStr] = performerHours.split("-");
// //     if (!startStr || !endStr) return activity;

// //     const [workStartHour, workStartMin] =
// //       startStr.trim().split(":").map(Number);

// //     const [workEndHour, workEndMin] =
// //       endStr.trim().split(":").map(Number);

// //     // ===============================
// //     // 🔥 SEQUENCE HANDLING (FIXED)
// //     // ===============================
// // let baseStart;

// // if (previousSequence !== activity.sequence) {

// //   // NEW SEQUENCE → take previous max end
// //   baseStart = previousSequenceMaxEnd
// //     ? previousSequenceMaxEnd
// //     : dayjs(activity.scheduledActivityStartTime);

// //   previousSequence = activity.sequence;
// //   currentSequenceStart = null;
// // }

// // if (!currentSequenceStart) {
// //   baseStart = previousSequenceMaxEnd
// //     ? previousSequenceMaxEnd
// //     : dayjs(activity.scheduledActivityStartTime);
// // } else {
// //   baseStart = currentSequenceStart;
// // }

// // let current = dayjs(baseStart);

// // // 🔥 ALWAYS adjust start to working hours
// // while (!isWorkingDay(current)) {
// //   current = current.add(1, "day");
// // }

// // let workingStart = current
// //   .hour(workStartHour)
// //   .minute(workStartMin)
// //   .second(0);

// // let workingEnd = current
// //   .hour(workEndHour)
// //   .minute(workEndMin)
// //   .second(0);

// // if (workingEnd.isBefore(workingStart)) {
// //   workingEnd = workingEnd.add(1, "day");
// // }

// // // Before working hours → shift same day
// // if (current.isBefore(workingStart)) {
// //   current = workingStart;
// // }

// // // After working hours → move to next valid working day start
// // if (current.isSame(workingEnd) || current.isAfter(workingEnd)) {

// //   current = current.add(1, "day");

// //   while (!isWorkingDay(current)) {
// //     current = current.add(1, "day");
// //   }

// //   current = current
// //     .hour(workStartHour)
// //     .minute(workStartMin)
// //     .second(0);
// // }

// // const adjustedStart = current;

// // if (!currentSequenceStart) {
// //   currentSequenceStart = adjustedStart;
// // }
// //     // ===============================
// //     // Calculate duration
// //     // ===============================

// //     const originalStart = dayjs(activity.scheduledActivityStartTime);
// //     const originalEnd = dayjs(activity.scheduledActivityEndTime);

// //     let remainingMinutes =
// //       originalEnd.diff(originalStart, "minute");

// //     while (remainingMinutes > 0) {

// //       if (!isWorkingDay(current)) {
// //         current = current.add(1, "day")
// //           .hour(workStartHour)
// //           .minute(workStartMin)
// //           .second(0);
// //         continue;
// //       }

// //       workingStart = current
// //         .hour(workStartHour)
// //         .minute(workStartMin)
// //         .second(0);

// //       workingEnd = current
// //         .hour(workEndHour)
// //         .minute(workEndMin)
// //         .second(0);

// //       if (workingEnd.isBefore(workingStart)) {
// //         workingEnd = workingEnd.add(1, "day");
// //       }

// //       if (current.isBefore(workingStart)) {
// //         current = workingStart;
// //       }

// //       const available = workingEnd.diff(current, "minute");

// //       if (available <= 0) {
// //         current = workingStart.add(1, "day");
// //         continue;
// //       }

// //       if (remainingMinutes <= available) {
// //         current = current.add(remainingMinutes, "minute");
// //         remainingMinutes = 0;
// //       } else {
// //         remainingMinutes -= available;
// //         current = workingStart.add(1, "day");
// //       }
// //     }

// //     const activityEnd = current;

// //     // ===============================
// //     // Track max end of sequence
// //     // ===============================

// //     if (!previousSequenceMaxEnd || previousSequence !== activity.sequence) {
// //       previousSequenceMaxEnd = activityEnd;
// //     } else {
// //       if (activityEnd.isAfter(previousSequenceMaxEnd)) {
// //         previousSequenceMaxEnd = activityEnd;
// //       }
// //     }

// //     return {
// //       ...activity,
// //       scheduledActivityStartTime:
// //         currentSequenceStart.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
// //       scheduledActivityEndTime:
// //         activityEnd.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
// //     };

// //   });

// const processedActivityList = activityList.map(activity => {

//     const performerHours = allUsersData.find(
//       user => user.userID === activity.performer
//     )?.workingHours;

//     console.log('Performer Hours  : ',performerHours," => ",activity.performer)

//     if (!performerHours) return activity;

//     const [startStr, endStr] = performerHours.split("-");
//     if (!startStr || !endStr) return activity;

//     const [workStartHour, workStartMin] =
//       startStr.trim().split(":").map(Number);

//     const [workEndHour, workEndMin] =
//       endStr.trim().split(":").map(Number);

//   //   const activityStart = dayjs(activity.scheduledActivityStartTime);
//   //  // const activityEnd = dayjs(activity.scheduledActivityEndTime);

    
//   // let workingStart = activityStart
//   // .hour(workStartHour)
//   // .minute(workStartMin)
//   // .second(0);

//   const startMinutes = workStartHour * 60 + workStartMin;
//   const endMinutes = workEndHour * 60 + workEndMin;

//   const totalWorkingDuration = endMinutes-startMinutes;

//   console.log('Start Minutes : ',startMinutes)
//   console.log('End Minutes : ',endMinutes)

//   console.log('Total Working duration of performer : ',totalWorkingDuration)


  


//   });

//   console.log("Processed Activity List:", processedActivityList);

//   setActivityList(processedActivityList);
// };

export const processWorkingHours = (
  activityList,
  allUsersData,
  weekdays,
  setActivityList
) => {

  const sortedActivities = [...activityList].sort(
    (a, b) => a.sequence - b.sequence
  );

  const sequenceStartMap = new Map();
  const sequenceMaxEndMap = new Map();

  // ✅ Working day logic
  const isWorkingDay = (date) => {
    const day = date.day();
    if (weekdays === "5") return day !== 0 && day !== 6; // Mon-Fri
    if (weekdays === "6") return day !== 0;              // Mon-Sat
    return true;
  };

  // ✅ Align date properly inside performer shift
  const getFreshShiftStart = (
  date,
  workStartHour,
  workStartMin,
  workEndHour,
  workEndMin
) => {

  let current = dayjs(date);

  // Skip non-working days
  while (!isWorkingDay(current)) {
    current = current.add(1, "day");
  }

  let workingStart = current.hour(workStartHour).minute(workStartMin).second(0);
  let workingEnd = current.hour(workEndHour).minute(workEndMin).second(0);

  if (workingEnd.isBefore(workingStart)) {
    workingEnd = workingEnd.add(1, "day");
  }

  // CASE 1: Before shift → same day shift start
  if (current.isBefore(workingStart)) {
    return workingStart;
  }

  // CASE 2: Inside shift → continue from current
  if (current.isSame(workingStart) || 
      (current.isAfter(workingStart) && current.isBefore(workingEnd))) {
    return current;
  }

  // CASE 3: After shift → next working day shift start
  current = current.add(1, "day");

  while (!isWorkingDay(current)) {
    current = current.add(1, "day");
  }

  return current.hour(workStartHour).minute(workStartMin).second(0);
};

  // ✅ Generic engine to consume minutes inside shift safely
  const consumeMinutesInsideShift = (
    startDate,
    minutesToConsume,
    workStartHour,
    workStartMin,
    workEndHour,
    workEndMin
  ) => {

    let current = dayjs(startDate);
    let remaining = minutesToConsume;

    while (remaining > 0) {

      while (!isWorkingDay(current)) {
        current = current.add(1, "day");
      }

      let workingStart = current.hour(workStartHour).minute(workStartMin).second(0);
      let workingEnd = current.hour(workEndHour).minute(workEndMin).second(0);

      if (workingEnd.isBefore(workingStart)) {
        workingEnd = workingEnd.add(1, "day");
      }

      if (current.isBefore(workingStart)) {
        current = workingStart;
      }

      const available = workingEnd.diff(current, "minute");

      if (available <= 0) {
        current = workingStart.add(1, "day");
        continue;
      }

      if (remaining <= available) {
        current = current.add(remaining, "minute");
        remaining = 0;
      } else {
        remaining -= available;
        current = workingStart.add(1, "day");
      }
    }

    return current;
  };

  const processedActivityList = sortedActivities.map((activity) => {

    const performerHours = allUsersData.find(
      (user) => user.userID === activity.performer
    )?.workingHours;
    

    if (!performerHours || activity?.performerType?.toLowerCase() ==='group') return activity;

    const [startStr, endStr] = performerHours.split("-");
    const [workStartHour, workStartMin] = startStr.trim().split(":").map(Number);
    const [workEndHour, workEndMin] = endStr.trim().split(":").map(Number);

    let baseDate;

    // 🔥 New sequence
    if (!sequenceStartMap.has(activity.sequence)) {

      const previousMaxEnds = [...sequenceMaxEndMap.values()];

      const highestEnd = previousMaxEnds.length
        ? previousMaxEnds.reduce((max, val) =>
            val.isAfter(max) ? val : max,
            previousMaxEnds[0]
          )
        : null;

      baseDate = highestEnd
        ? highestEnd
        : dayjs(activity.scheduledActivityStartTime);

      const sequenceStart = getFreshShiftStart(
        baseDate,
        workStartHour,
        workStartMin,
        workEndHour,
        workEndMin
      );

      sequenceStartMap.set(activity.sequence, sequenceStart);
    }

    // 🔥 SAME SEQUENCE → always realign per performer
    let baseStart = sequenceStartMap.get(activity.sequence);

    let adjustedStart = getFreshShiftStart(
      baseStart,
      workStartHour,
      workStartMin,
      workEndHour,
      workEndMin
    );

    // ✅ Apply buffer safely inside shift
    const bufferMinutes = activity?.buffer ?? 0;

    adjustedStart = consumeMinutesInsideShift(
      adjustedStart,
      bufferMinutes,
      workStartHour,
      workStartMin,
      workEndHour,
      workEndMin
    );

    // ✅ Calculate duration safely inside shift
    const originalStart = dayjs(activity.scheduledActivityStartTime);
    const originalEnd = dayjs(activity.scheduledActivityEndTime);

    const durationMinutes = originalEnd.diff(originalStart, "minute");

    const activityEnd = consumeMinutesInsideShift(
      adjustedStart,
      durationMinutes,
      workStartHour,
      workStartMin,
      workEndHour,
      workEndMin
    );

    // 🔥 Track max end for sequence
    if (!sequenceMaxEndMap.has(activity.sequence)) {
      sequenceMaxEndMap.set(activity.sequence, activityEnd);
    } else {
      const existing = sequenceMaxEndMap.get(activity.sequence);
      if (activityEnd.isAfter(existing)) {
        sequenceMaxEndMap.set(activity.sequence, activityEnd);
      }
    }

    return {
      ...activity,
      scheduledActivityStartTime:
        adjustedStart.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      scheduledActivityEndTime:
        activityEnd.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      workingHours: performerHours
    };
  });

  setActivityList(processedActivityList);
};
  
      