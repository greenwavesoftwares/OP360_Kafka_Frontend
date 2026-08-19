import React, { useState, useEffect } from "react";
import { TreeSelect } from "primereact/treeselect";

export default function LocalVariablesTab({ handleLabelClick }) {
  const [nodes, setNodes] = useState(null);
  //   const [selectedNodeKey, setSelectedNodeKey] = useState(null);

  useEffect(() => {
    // Demo data to replace NodeService.getTreeNodes()
    const demoData = [
      {
        key: "lv_user",
        label: "User",
        children: [
          {
            key: "lv_user.userID",
            label: "UserID",
            children: [],
          },
          {
            key: "lv_user.tenantId",
            label: "TenantID",
            children: [],
          },
          // {
          //   key: "lv_user.password",
          //   label: "Password",
          //   children: [],
          // },
          {
            key: "lv_user.phone",
            label: "Phone",
            children: [],
          },
          {
            key: "lv_user.location",
            label: "location",
            children: [],
          },

          // {
          //   key: "lv_user.workFlowHomePage",
          //   label: "WorkFlow HomePage",
          //   children: [],
          // },
          // {
          //   key: "lv_user.g360HomePage",
          //   label: "G360 HomePage",
          //   children: [],
          // },
          // {
          //   key: "lv_user.createdOn",
          //   label: "Created On",
          //   children: [],
          // },
          // {
          //   key: "lv_user.modifiedOn",
          //   label: "Modified On",
          //   children: [],
          // },
          // {
          //   key: "lv_user.createdBy",
          //   label: "Created By",
          //   children: [],
          // },
          // {
          //   key: "lv_user.modifiedBy",
          //   label: "Modified By",
          //   children: [],
          // },
          {
            key: "lv_user.department",
            label: "Department",
            children: [],
          },
          // {
          //   key: "lv_user.passwordExpiryDate",
          //   label: "Password Expiry Date",
          //   children: [],
          // },
          // {
          //   key: "lv_user.lastLogin",
          //   label: "Last Login",
          //   children: [],
          // },
        ],
      },
      // {
      //   key: "lv_job",
      //   label: "Job",
      //   children: [
      //     {
      //       key: "lv_job.jobName",
      //       label: "Job Name",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.jobID",
      //       label: "Job ID",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.assigner",
      //       label: "Assigner",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.approver",
      //       label: "Approver",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.scheduledJobStartTime",
      //       label: "Scheduled Job Start Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.scheduledJobEndTime",
      //       label: "Scheduled Job End Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.actualJobStartTime",
      //       label: "Actual Job Start Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.actualJobEndTime",
      //       label: "Actual Job End Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.reviewerIntimationTime",
      //       label: "Reviewer Intimation Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.priority",
      //       label: "Priority",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.instrument",
      //       label: "Instrument",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.groupid",
      //       label: "Group ID",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.remarks",
      //       label: "Remarks",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.jobStatus",
      //       label: "Job Status",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.priorityColor",
      //       label: "Priority Color",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.awatingTime",
      //       label: "Awaiting Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.progress",
      //       label: "Progress",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.weekdays",
      //       label: "Weekdays",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.currentActivityName",
      //       label: "Current Activity Name",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.currentPerformer",
      //       label: "Current Performer",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.fileName",
      //       label: "File Name",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.performerLists",
      //       label: "Performer Lists",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.activitylists",
      //       label: "Activity Lists",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.activityId",
      //       label: "Activity ID",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.versionNumber",
      //       label: "Version Number",
      //       children: [],
      //     },

      //     {
      //       key: "lv_job.scheduledActivityStartTime",
      //       label: "Scheduled Activity Start Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.scheduledActivityEndTime",
      //       label: "scheduled Activity End Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.actualActivityStartTime",
      //       label: "Actual Activity Start Time",
      //       children: [],
      //     },
      //     {
      //       key: "lv_job.actualActivityEndTime",
      //       label: "Actual Activity End Time",
      //       children: [],
      //     },
      //   ],
      // },
      {
        key: "lv_job",
        label: "Job",
        children: [
          {
            key: "lv_job.jobName",
            label: "Job Name",
            children: [],
          },
          {
            key: "lv_job.jobID",
            label: "Job ID",
            children: [],
          },
          {
            key: "lv_job.assigner",
            label: "Assigner",
            children: [],
          },
          {
            key: "lv_job.approver",
            label: "Approver",
            children: [],
          },
          {
            key: "lv_job.scheduledJobStartTime",
            label: "Scheduled Job Start Time",
            children: [],
          },
          {
            key: "lv_job.scheduledJobEndTime",
            label: "Scheduled Job End Time",
            children: [],
          },
          {
            key: "lv_job.actualJobStartTime",
            label: "Actual Job Start Time",
            children: [],
          },
          {
            key: "lv_job.actualJobEndTime",
            label: "Actual Job End Time",
            children: [],
          },
          {
            key: "lv_job.reviewerIntimationTime",
            label: "Reviewer Intimation Time",
            children: [],
          },
          {
            key: "lv_job.priority",
            label: "Priority",
            children: [],
          },
          {
            key: "lv_job.instrument",
            label: "Instrument",
            children: [],
          },
          {
            key: "lv_job.groupid",
            label: "Group ID",
            children: [],
          },
          {
            key: "lv_job.remarks",
            label: "Remarks",
            children: [],
          },
          {
            key: "lv_job.jobStatus",
            label: "Job Status",
            children: [],
          },
          {
            key: "lv_job.priorityColor",
            label: "Priority Color",
            children: [],
          },
          {
            key: "lv_job.awatingTime",
            label: "Awaiting Time",
            children: [],
          },
          {
            key: "lv_job.progress",
            label: "Progress",
            children: [],
          },
          {
            key: "lv_job.weekdays",
            label: "Weekdays",
            children: [],
          },
          {
            key: "lv_job.currentActivityName",
            label: "Current Activity Name",
            children: [],
          },
          {
            key: "lv_job.currentPerformer",
            label: "Current Performer",
            children: [],
          },
          {
            key: "lv_job.fileName",
            label: "File Name",
            children: [],
          },
          {
            key: "lv_job.performerLists",
            label: "Performer Lists",
            children: [],
          },
          // {
          //   key: "lv_job.versionNumber",
          //   label: "Version Number",
          //   children: [],
          // },

          // Group all activity-related fields under a visual "Activity" section
          {
            key: "lv_job_activity", // Logical group label (NOT affecting the keys)
            label: "Activity",
            children: [
              {
                key: "lv_job.activitylists", // original key preserved
                label: "Activity Lists",
                children: [],
              },
              {
                key: "lv_job.activityId",
                label: "Activity ID",
                children: [],
              },
              {
                key: "lv_job.scheduledActivityStartTime",
                label: "Scheduled Activity Start Time",
                children: [],
              },
              {
                key: "lv_job.scheduledActivityEndTime",
                label: "Scheduled Activity End Time",
                children: [],
              },
              {
                key: "lv_job.actualActivityStartTime",
                label: "Actual Activity Start Time",
                children: [],
              },
              {
                key: "lv_job.actualActivityEndTime",
                label: "Actual Activity End Time",
                children: [],
              },
            ],
          },
        ],
      },
      {
        key: "lv_form",
        label: "Form",
        children: [
          {
            key: "lv_form.formName",
            label: "Form Name",
            children: [],
          },
          // {
          //   key: "lv_form.tableSQL",
          //   label: "Table SQL",
          //   children: [],
          // },
          // {
          //   key: "lv_form.insertSql",
          //   label: "Insert SQL",
          //   children: [],
          // },
          // {
          //   key: "lv_form.deleteSQL",
          //   label: "Delete SQL",
          //   children: [],
          // },
          {
            key: "lv_form.createdUser",
            label: "Created User",
            children: [],
          },
          {
            key: "lv_form.documentId",
            label: "Document ID",
            children: [],
          },
          {
            key: "lv_form.department",
            label: "Department",
            children: [],
          },
          {
            key: "lv_form.selectedGrp",
            label: "Group",
            children: [],
          },
          {
            key: "lv_form.formatID",
            label: "Format ID",
            children: [],
          },
          {
            key: "lv_form.isActiveForm",
            label: "Is Active Form",
            children: [],
          },
          {
            key: "lv_form.versionNumber",
            label: "Version Number",
            children: [],
          },
        ],
      },
    ];

    // Function to traverse and mark leaf nodes as selectable
    const markLeafNodesSelectable = (node) => {
      if (node.children?.length !== 0) {
        // If the node has children, it's a parent node and can't be selected
        node.selectable = false;
        // Recursively mark child nodes
        node.children.forEach(markLeafNodesSelectable);
      } else {
        // If it's a leaf node (no children), it can be selected
        node.selectable = true;
      }
      return node;
    };

    // Update nodes to mark only leaf nodes as selectable
    const updatedNodes = demoData.map(markLeafNodesSelectable);
    setNodes(updatedNodes);
  }, []);

  return (
    <div className="card flex">
      <TreeSelect
        // value={selectedNodeKey}
        onChange={(e) => handleLabelClick(e.value)}
        options={nodes}
        className="w-full"
        placeholder="Local variables"
        filter
      />
    </div>
  );
}
