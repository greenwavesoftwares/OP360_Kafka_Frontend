import { useState } from "react";
import ActivityDetails from "./ActivityDetails";
import { Form, useFormik } from "formik";

export function AddActivity(props) {
  const [activity, setActivity] = useState({});

  const formik = useFormik({
    initialValues: {},

    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));

      console.log(activity);

      //   props.updateTaskHandler(activity);

      formik.resetForm();
    },
  });

  return (
    <div>
      <Form></Form>
    </div>
  );
}
