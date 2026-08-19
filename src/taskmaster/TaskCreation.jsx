import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import { useEffect, useState } from "react";

export default function TaskCreation(props){

    const [task,setTask] = useState({});

    return <div>

        {/* <h1 >Task Creation</h1> */}

<span><h3 style={{position : 'relative',right : '12rem',top : '3rem'}}>Task Name</h3></span>   
  
   <InputText value={props.taskName} placeholder="Enter task name" onChange={e => {
    
    props.setTaskName(e.target.value);

    // console.log(e.target.value);

   }} required/>


<span><h3 style={{position : 'relative',right : '12rem',top : '3rem'}}>Description</h3></span>   
   <InputTextarea  value={props.description} placeholder="Enter description" onChange={e => {
    
    props.setDescription(e.target.value);

    console.log(e.target.value);

   }} required/>

<br/>


   <span><h3 style={{position : 'relative',right : '12rem',top : '3rem'}}>Select Reviewer</h3></span>   
   <Dropdown value={props.reviewer} placeholder="Select reviewer" options={props.users} optionLabel="userName" required
    onChange={e => { 

    props.setReviewer(e.value);

    console.log(e.value);

   }}/>





    </div>
}