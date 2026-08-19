import React, { useEffect, useState } from 'react'
import { extendTokenExpiration } from './helper/AuthService';
import { Button } from 'primereact/button';
 import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { useTabNotification } from 'react-haiku';
 

function TokenMessage({  toastRef, ...props }) {
    const {
        setTitlePrefix,
        setFlashMessage,
        setIsShown,
        setCustomTitle,
        setShowFaviconDot,
        setFaviconDotColor,
      } = useTabNotification();
    
    const [countDown, setCountDown] = useState(30); // Initialize countdown with 30 seconds
    // const [tokenExtended, setTokenExtended] = useState(false);
    const navigate = useNavigate();
    const flagCountdown=()=>
    {
        return(
        <div>
            <i className="pi pi-flag-fill" style={{ color: 'slateblue' }}></i>
        </div>
        );
    };

    useEffect(() => {
       
        const interval = setInterval(() => {
            setCountDown((prevCount) => {
                //  document.title = `⚠ Operations360`;
                if(prevCount>=2)
                    {
                    // setTitlePrefix('[ALERT]');
                    setFlashMessage('📢 Session expiring ‼️');
                    setShowFaviconDot(true);
                    setIsShown(true);
                    }
                    else
                    {
                        // setTitlePrefix('');
                        // setFlashMessage('');
                        console.log('Closing dot')
                        setShowFaviconDot(false);
                        setIsShown(false);
                        document.title = `Operations360`;
                    }
               
                 
                console.log("Prev Count: ", prevCount);
                if (prevCount > 0) {
                    
                    
                    
                    return prevCount - 1; // Decrease countdown by 1 each second
                }
                 else {
                    // toastRef.current.clear();
                    console.log("Final Count for Exit: ", prevCount);
    
                    // Handle localStorage cleanup
                    const savedTenant = localStorage.getItem("savedTenant"); // Get the savedTenant value
                    localStorage.clear(); // Clear all items in localStorage
    
                    if (savedTenant) {
                        localStorage.setItem("savedTenant", savedTenant); // Restore savedTenant if it exists
                    }
    
                    // window.location.href = `/`; // Redirect to the home page
                     
                     navigate('/');
                     clearInterval(interval);
                    return 0; // Ensure the countdown is set to 0
                }
            });
        }, 1000);
    
        // Cleanup the interval when the component is unmounted
        return () => {
            clearInterval(interval);

            // setIsShown(false);
            // setShowFaviconDot(false);
            // setFaviconDotColor('');
            document.title = `Operations360`;
            // setCustomTitle('Operations360');
            // setTimeout(() => {
            //     setIsShown(false)
            // setShowFaviconDot(false)
            // }, 1000);
            
            
           
        };
    }, []); 
    
  return (
    <div>
          <div
                    className="flex flex-column align-items-start gap-2 p-2"
                    style={{ flex: '1', fontSize: '0.875rem', lineHeight: '1.25rem', color: '#333',boxShadow:1 }}
                >
                    {/* Warning Message */}
                    <div
                        className="flex align-items-center gap-2 p-1 border-round"
                        style={{
                            backgroundColor: '#fff4e5',
                            color: '#d9822b',
                            border: '1px solid #d9822b',
                            fontSize: '0.75rem',
                            padding: '0.5rem',
                        }}
                    >
                       <i className="pi pi-exclamation-triangle" style={{ fontSize: '1rem' }}></i>
                       <span>
    Your session will expire in the next{' '}
    <motion.span
    key={countDown} // A unique key to trigger animation when the countdown changes
    initial={{ opacity: 0, y: 50 }} // Start hidden with the element below the view
    animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }} // Animate to visible and its final position using a spring effect
    // exit={{ opacity: 0, y: -50, transition: { type: 'spring', stiffness: 100 } }} // Exit animation upwards with reduced opacity
    style={{ fontWeight: 'bold', color: 'red' }} // Styling for bold red text
>
        {countDown}
    </motion.span>{' '}
    seconds.
</span>

                    </div>
                
                    {/* Message Summary */}
                    <div
    className="text-sm font-normal my-2 text-900"
    style={{ whiteSpace: 'nowrap' }} // Prevent text from breaking
>
    {props.message.summary}
</div>

                    
                    {/* Reply Button */}
                    <Button
                        className="p-button-sm flex align-items-center justify-content-center"
                        label="Yes"
                        icon="pi pi-check"
                        severity="success"
                        style={{
                            fontSize: '0.75rem',
                            height: '2rem',
                            padding: '0.5rem 1rem',
                        }}
                        // disabled={countDown===1}
                       
                        onClick={() => {
                             document.title = `Operations360`
                            extendTokenExpiration();
                            // setTokenExtended(true);
                            console.log('Yes clicked');
                            setIsShown(false)
            setShowFaviconDot(false)
                             toastRef.current.clear();
                            // setTimeout(() => setVisible(true), 10000);
                        }}
                    />
                </div>
    </div>
  )
}

export default TokenMessage