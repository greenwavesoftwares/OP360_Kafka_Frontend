import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';

export default function CustomToast({toastRef}) {
    const clear = () => {
        toastRef.current.clear();
    };

   
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toastRef} position="top-right" onRemove={clear} />
        </div>
    );
}
