import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Test(){

 
    const navigate = useNavigate();  

        

        const fetchData = async () => {

          await fetch('http://localhost:8089',{
            method : 'GET',
          })
          .then(resp => {

                console.log(resp);

                if(resp.status === 401){
                    navigate('/login');
                }

          })
          

        }

        fetchData();


        return <h1>hello</h1>
}