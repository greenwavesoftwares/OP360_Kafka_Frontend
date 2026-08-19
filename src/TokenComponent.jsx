import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { extendTokenExpiration } from './helper/AuthService';
import TokenMessage from './TokenMessage';
import { useNavigate } from 'react-router-dom';

export default function TokenComponent({ visible, setVisible }) {
    const toastRef = useRef(null);
   

    const clear = () => {
         toastRef.current.clear();
        setVisible(false);
        // console.log('Toast was removed explicitly')
    };

    // useEffect(() => {
    //     if (!tokenExtended) {
    //         navigate('/');
    //     }
    // }, [tokenExtended]); // This will trigger navigation whenever tokenExtended changes

    useEffect(() => {
        if (visible) {
             toastRef.current.clear();
             toastRef.current.show({
                severity: 'warn',
                summary: 'Do you want to continue the session?',
                // sticky: true,
                life: 31000,
                closable:false,
                content: (props) => (
                  
                <TokenMessage
                {...props}
                 toastRef={ toastRef}
                // setTokenExtended={setTokenExtended}
                />
                )
            });
        }
    }, [visible]); // Run when `visible` changes

    return (
        <div className="card flex justify-content-center">
            <Toast ref={ toastRef} position="top-right" onRemove={clear} onHide={()=>{
                clear();
                setVisible(false)
                // setTimeout(() => {
                //     console.log('Toast extended ? ',tokenExtended)
                //     if(!tokenExtended){
                //         navigate('/');
                //     }
                // }, 1000);
                // console.log('Toast closed !')
                // setTokenExtended(false);
            }} />
            {/* <Button label="Yes" onClick={() => extendTokenExpiration()} /> */}
        </div>
    );
}
