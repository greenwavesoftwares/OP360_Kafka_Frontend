import { Form, useFormik } from "formik";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function AddActivityDialog(props) {
  const [activity, setActivity] = useState({});
  const [assetGroup, setAssetGroup] = useState("");

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));

      console.log(activity);

      // formik.resetForm();
    },
  });

  return (
    <div>
      <Dialog visible={props.visible} onHide={props.onHide} style={{textAlign : 'center',width : '40rem'}}>

            <h2 style={{position : 'relative',bottom : 25}}>Add Activity</h2>

        <Form>
          <form onSubmit={formik.handleSubmit}>
            <h3>Activity Name</h3>
            <InputText
              value={activity ? activity.activityName : ''}
              placeholder="Enter Activity name"
              onChange={(e) => activity.activityName = e.target.value}
            />

            <h3>Activity Identity</h3>
            <InputText
              value={activity ? activity.activityId : ''}
              placeholder="Enter Activity Identity"
              onChange={(e) => activity.activityId = e.target.value}
            />

            <h3>Type of Asset</h3>
            {/* <Dropdown
              value={assetGroup}
              placeholder="Select reviewer"
              options={props.assetGroup ? props.assetGroup : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            /> */}

              
            <h3>Logbook</h3>
            <Dropdown
              value={assetGroup}
              placeholder="Select Logbook"
              options={props.logbooks ? props.logbooks : ''}
              optionLabel="GroupName"
              required
              onChange={(e) => {
                
                setAssetGroup(e.value);

                console.log(e.value);

              }}
            />

              
            
          </form>
        </Form>
      </Dialog>
    </div>
  );
}
